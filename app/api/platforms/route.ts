import {NextResponse} from 'next/server';import {igdb} from '@/lib/igdb';
export async function GET(){try{return NextResponse.json(await igdb('platforms','fields id,name; limit 100; sort name asc;'))}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Unable to load platforms'},{status:503})}}
