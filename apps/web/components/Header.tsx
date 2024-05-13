import { GithubLogo, XLogo } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import React from 'react'

export default function Header() {
    return (
        <header className='w-full fixed glass z-50 '>
            <nav className='max-w-6xl p-5 mx-auto  flex gap-5 items-center justify-between h-[80px]'>
                <Link href={"/"} className='font-semibold text-lg md:text-xl animate-shine bg-[linear-gradient(110deg,#939393,40%,#fff,60%,#939393)] bg-[length:200%_100%] text-transparent bg-clip-text'>rebox.dev</Link>
                <div className='hidden md:flex items-center gap-5 md:text-lg basis-0 text-muted-foreground'>

                    <Link href={"/roadmap"} className=''>Roadmap</Link>
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
