import type {Game} from '@/types';
const API='https://api.igdb.com/v4';
let tokenCache:{token:string;expires:number}|null=null;
async function accessToken(){
 const id=process.env.TWITCH_CLIENT_ID, secret=process.env.TWITCH_CLIENT_SECRET;
 if(!id||!secret) throw new Error('IGDB is not configured. Add TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET to .env.local.');
 if(tokenCache&&tokenCache.expires>Date.now()+60_000) return tokenCache.token;
 const url=new URL('https://id.twitch.tv/oauth2/token'); url.searchParams.set('client_id',id);url.searchParams.set('client_secret',secret);url.searchParams.set('grant_type','client_credentials');
 const res=await fetch(url,{method:'POST',cache:'no-store'}); if(!res.ok) throw new Error('Twitch authentication failed. Check your API credentials.');
 const data=await res.json(); tokenCache={token:data.access_token,expires:Date.now()+data.expires_in*1000};return tokenCache.token;
}
export async function igdb<T=Game[]>(endpoint:string,query:string):Promise<T>{
 const id=process.env.TWITCH_CLIENT_ID!; const token=await accessToken();
 const res=await fetch(`${API}/${endpoint}`,{method:'POST',headers:{'Client-ID':id,Authorization:`Bearer ${token}`,'Content-Type':'text/plain','Accept':'application/json'},body:query,next:{revalidate:900}});
 if(!res.ok){const detail=await res.text();throw new Error(`IGDB request failed (${res.status}): ${detail.slice(0,180)}`)} return res.json();
}
export const GAME_FIELDS='id,name,slug,summary,storyline,rating,rating_count,total_rating,total_rating_count,first_release_date,hypes,cover.image_id,artworks.image_id,screenshots.image_id,videos.video_id,videos.name,genres.name,platforms.name,platforms.abbreviation,involved_companies.developer,involved_companies.publisher,involved_companies.company.name,game_modes.name,themes.name,player_perspectives.name,similar_games,release_dates.date,release_dates.human,release_dates.category,release_dates.platform.name';
export function gameImage(id?:string,size='t_720p'){return id?`https://images.igdb.com/igdb/image/upload/${size}/${id}.jpg`:''}
