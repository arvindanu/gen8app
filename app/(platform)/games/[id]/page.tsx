import {GameDetailView} from '@/components/views';export default async function GamePage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <GameDetailView id={id}/>}
