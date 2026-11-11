import {NextRequest,NextResponse} from 'next/server';
import {igdb,GAME_FIELDS} from '@/lib/igdb';
import type {Game} from '@/types';
export const runtime='nodejs';
export async function GET(req:NextRequest){
 try{
  const p=req.nextUrl.searchParams,mode=p.get('mode')||'discover',q=p.get('q')?.trim(),limit=Math.min(30,Math.max(1,Number(p.get('limit')||18))),offset=Math.max(0,Number(p.get('offset')||0));
  const ids=p.get('ids');if(ids){const valid=ids.split(',').filter(x=>/^\d+$/.test(x)).slice(0,30);if(!valid.length)return NextResponse.json({games:[],count:0,nextOffset:null});const games=await igdb<Game[]>('games',`fields ${GAME_FIELDS}; where id = (${valid.join(',')}) & cover.image_id != null; limit ${valid.length};`);const map=new Map(games.map(g=>[g.id,g]));const ordered=valid.map(x=>map.get(Number(x))).filter((g):g is Game=>Boolean(g));return NextResponse.json({games:ordered,count:ordered.length,nextOffset:null});}
  const where:string[]=['cover.image_id != null'];
  const genre=p.get('genre'),platform=p.get('platform'),year=p.get('year'),minRating=p.get('minRating');
  if(genre&&/^\d+$/.test(genre))where.push(`genres = (${Number(genre)})`);
  if(platform&&/^\d+$/.test(platform))where.push(`platforms = (${Number(platform)})`);
  if(year&&/^\d{4}$/.test(year))where.push(`first_release_date >= ${Date.UTC(Number(year),0,1)/1000} & first_release_date < ${Date.UTC(Number(year)+1,0,1)/1000}`);
  if(minRating&&/^\d+(\.\d+)?$/.test(minRating))where.push(`rating >= ${Number(minRating)*10}`);
  const now=Math.floor(Date.now()/1000);
  if(mode==='upcoming')where.push(`first_release_date > ${now}`);
  else if(mode==='recent')where.push(`first_release_date > ${now-60*60*24*365*2} & first_release_date < ${now}`);
  else if(mode==='rated')where.push('rating != null & rating_count > 20');
  let sort='hypes desc';const sorting=p.get('sort');
  if(sorting==='rating')sort='rating desc';if(sorting==='newest')sort='first_release_date desc';if(sorting==='oldest')sort='first_release_date asc';if(sorting==='name')sort='name asc';if(mode==='upcoming')sort='first_release_date asc';
  const safeSearch=q?.replace(/["\\]/g,'');
  const searchClause=safeSearch?`search "${safeSearch}"; `:'';
  const query=`${searchClause}fields ${GAME_FIELDS}; where ${where.join(' & ')}; sort ${sort}; limit ${limit}; offset ${offset};`;
  let games:Game[];
  if(mode==='trending'&&!q&&!genre&&!platform&&!year&&!minRating&&sorting!=='rating'&&sorting!=='newest'&&sorting!=='oldest'&&sorting!=='name'){
   try{
    const primitives=await igdb<{game_id:number;value:number}[]>('popularity_primitives',`fields game_id,value; where popularity_type = 1; sort value desc; limit ${Math.min(500,limit+offset)};`);
    const ids=primitives.slice(offset,offset+limit).map(x=>x.game_id);
    const found=ids.length?await igdb<Game[]>('games',`fields ${GAME_FIELDS}; where id = (${ids.join(',')}) & cover.image_id != null; limit ${limit};`):[];
    const byId=new Map(found.map(g=>[g.id,g]));games=ids.map(id=>byId.get(id)).filter((g):g is Game=>Boolean(g));
    if(!games.length)games=await igdb<Game[]>('games',query);
   }catch{games=await igdb<Game[]>('games',query)}
  }else games=await igdb<Game[]>('games',query);
  return NextResponse.json({games,count:games.length,nextOffset:games.length===limit?offset+limit:null});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to load games'},{status:503})}
}
