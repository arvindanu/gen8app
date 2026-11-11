import {NextResponse} from 'next/server';import {igdb} from '@/lib/igdb';
export async function GET(){try{return NextResponse.json(await igdb('genres','fields id,name; limit 50; sort name asc;'))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to load genres'},{status:503})}}
