import {NextRequest,NextResponse} from 'next/server';
import {igdb,GAME_FIELDS} from '@/lib/igdb';
import type {Game} from '@/types';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 try{
  const rawQuery=(req.nextUrl.searchParams.get('q')||'').trim();
  if(rawQuery.length<2)return NextResponse.json({franchises:[]});
  // IGDB's `search` command is not supported by the franchises endpoint.
  // Use its searchable name field with a case-insensitive contains filter instead.
  const safeQuery=rawQuery.replace(/["\\\r\n\t]/g,' ').replace(/\s+/g,' ').trim();
  if(safeQuery.length<2)return NextResponse.json({franchises:[]});
  const matches=await igdb<{id:number;name:string;games?:number[] }[]>(
   'franchises',
   `fields id,name,games; where name ~ *"${safeQuery}"*; limit 12;`
  );
  const franchises=await Promise.all(matches.map(async f=>{
   const ids=(f.games||[]).slice(0,30);
   const games=ids.length?await igdb<Game[]>('games',`fields ${GAME_FIELDS}; where id = (${ids.join(',')}) & cover.image_id != null; limit 30;`):[];
   return {id:f.id,name:f.name,games};
  }));
  return NextResponse.json({franchises});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to search franchises'},{status:503})}
}
