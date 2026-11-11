export type Game = {
 id:number; name:string; slug?:string; summary?:string; storyline?:string; rating?:number; rating_count?:number;
 first_release_date?:number; cover?:{id:number;image_id:string}; artworks?:{id:number;image_id:string}[];
 screenshots?:{id:number;image_id:string}[]; videos?:{id:number;video_id:string;name?:string}[];
 genres?:{id:number;name:string}[]; platforms?:{id:number;name:string;abbreviation?:string}[];
 involved_companies?:{developer?:boolean;publisher?:boolean;company?:{name:string}}[];
 game_modes?:{name:string}[]; themes?:{name:string}[]; player_perspectives?:{name:string}[];
 similar_games?:number[]; hypes?:number; total_rating?:number; total_rating_count?:number;
 release_dates?:{date?:number;human?:string;category?:number;platform?:{name:string}}[];
};
export type GameResponse={games:Game[];count:number;nextOffset:number|null};
