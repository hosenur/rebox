import { GithubLogo, XLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <header className='w-full fixed glass z-50'>
            <nav className='max-w-6xl py-5 mx-auto  flex gap-5 items-center justify-between'>
                <Link href={"/"} className='font-semibold text-xl animate-shine bg-[linear-gradient(110deg,#939393,40%,#fff,60%,#939393)] bg-[length:200%_100%] text-transparent bg-clip-text'>rebox.dev</Link>
                <div className='flex items-center gap-5 text-lg basis-0 text-muted-foreground'>

                    <Link href={"/"} className=''>Roadmap</Link>
                    <Link href={"/"} className=''>Changelogs</Link>
                    <Link href={"/"} className=''>Docs</Link>
                </div>
                <div className='flex items-center gap-5'>
                    <GithubLogo size={25} />
                    <XLogo size={25} /> 
                </div>
            </nav>
        </header>
    )
}
