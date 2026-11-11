export function dateLabel(seconds?:number){if(!seconds)return 'Release date TBA';return new Intl.DateTimeFormat('en',{month:'short',day:'numeric',year:'numeric'}).format(new Date(seconds*1000))}
export function yearFrom(seconds?:number){return seconds?new Date(seconds*1000).getFullYear():''}
export function ratingLabel(rating?:number){return rating?Math.round(rating)/10+'/10':'N/A'}
