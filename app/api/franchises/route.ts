import {NextRequest,NextResponse} from 'next/server';
import {igdb,GAME_FIELDS} from '@/lib/igdb';
import type {Game} from '@/types';
export const runtime='nodejs';
type Franchise={id:number;name:string;games?:number[]};
type PopularGame={id:number;franchise?:number;cover?:{image_id:string};hypes?:number};

async function franchiseCards(popularOnly=false){
 if(popularOnly){
  // Rank franchises by how often their games appear among IGDB's most popular titles.
  const primitives=await igdb<{game_id:number;value:number}[]>('popularity_primitives',`fields game_id,value; where popularity_type = 1; sort value desc; limit 250;`);
  const popularIds=primitives.map(x=>x.game_id).filter(Number.isFinite);
  if(!popularIds.length)return [];
  const popularGames=await igdb<PopularGame[]>('games',`fields id,franchise,cover.image_id,hypes; where id = (${popularIds.join(',')}) & franchise != null; limit 250;`);
  const popularityRank=new Map(popularIds.map((id,index)=>[id,index]));
  const scores=new Map<number,{score:number;first:number}>();
  for(const game of popularGames){if(!game.franchise)continue;const rank=popularityRank.get(game.id)??9999;const current=scores.get(game.franchise)||{score:0,first:rank};current.score+=250-rank;current.first=Math.min(current.first,rank);scores.set(game.franchise,current)}
  const ids=[...scores.entries()].sort((a,b)=>b[1].score-a[1].score||a[1].first-b[1].first).slice(0,9).map(([id])=>id);
  if(!ids.length)return [];
  const records=await igdb<Franchise[]>('franchises',`fields id,name,games; where id = (${ids.join(',')}); limit ${ids.length};`);
  const byId=new Map(records.map(f=>[f.id,f]));
  return Promise.all(ids.map(async id=>{const f=byId.get(id);if(!f)return null;const gameIds=(f.games||[]).slice(0,30);const games=gameIds.length?await igdb<Game[]>('games',`fields ${GAME_FIELDS}; where id = (${gameIds.join(',')}) & cover.image_id != null; limit 30;`):[];return {id:f.id,name:f.name,games}})).then(rows=>rows.filter((x):x is NonNullable<typeof x>=>Boolean(x)));
 }
 return [];
}

export async function GET(req:NextRequest){
 try{
  const rawQuery=(req.nextUrl.searchParams.get('q')||'').trim();
  if(rawQuery.length<2){const franchises=await franchiseCards(true);return NextResponse.json({franchises,popular:true})}
  // IGDB's `search` command is not supported by the franchises endpoint.
  // Use its searchable name field with a case-insensitive contains filter instead.
  const safeQuery=rawQuery.replace(/["\\\r\n\t]/g,' ').replace(/\s+/g,' ').trim();
  if(safeQuery.length<2)return NextResponse.json({franchises:[],popular:false});
  const matches=await igdb<Franchise[]>('franchises',`fields id,name,games; where name ~ *"${safeQuery}"*; limit 12;`);
  const franchises=await Promise.all(matches.map(async f=>{
   const ids=(f.games||[]).slice(0,30);
   const games=ids.length?await igdb<Game[]>('games',`fields ${GAME_FIELDS}; where id = (${ids.join(',')}) & cover.image_id != null; limit 30;`):[];
   return {id:f.id,name:f.name,games};
  }));
  return NextResponse.json({franchises,popular:false});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to load franchises'},{status:503})}
}
