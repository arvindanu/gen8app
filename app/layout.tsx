import type {Metadata} from 'next';import './globals.css';import {Shell} from '@/components/shell';
export const metadata:Metadata={title:'GEN8 — Enter Your Next World',description:'Discover extraordinary games. Explore new worlds. Find your next obsession.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Shell>{children}</Shell></body></html>}
