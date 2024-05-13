import { Copy, GithubLogo, RocketLaunch } from '@phosphor-icons/react/dist/ssr'
import React from 'react'
import { Button } from './ui/button'

export default function Hero() {
    return (
        <div className='flex flex-col items-center text-center gap-5'>
            <div className="inline-flex animate-shine items-center justify-center rounded-full  border border-neutral-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-3 py-1 font- text-neutral-400 transition-colors gap-2 ">
                <p>
                    Alpha Release Is Live
                </p>
                <RocketLaunch size={20} />
            </div>

            <h1 className='text-8xl md:text-9xl uppercase font-black'>Rebox</h1>

            <p className='w-full md:w-3/4 md:text-lg text-balance text-muted-foreground'>Deploy your applications, services, databases with the best DX, with Rebox. A feature rich deployment solution which runs on your infrastructure and gives you complete control of your system. Rebox is a feature packed system, which aims in skipping the figuring out part while deplyments</p>

            <div className='relative shadow-2xl shadow-neutral-700'>
                <div className='absolute top-0 flex w-full justify-center'>
                    <div className='left-0 h-[1px] animate-border-width rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000' />
                </div>
                <div className='flex h-full items-center justify-center rounded-md border border-gray-800 bg-gradient-to-b from-gray-950 to-black px-3 py-2'>
                    <div className='flex items-center gap-5 font-mono text-xl text-muted-foreground'>
                        <p className='text-xs md:text-sm text-gray-200'>curl -fsSL https://rebox.dev/install.sh | sh</p>
                        <Copy size={20} className='hidden md:block' />
                    </div>
                </div>
            </div>



             <div className='flex gap-5'>
                 <Button className='flex gap-2'>
                     <GithubLogo size={20} weight='duotone' />
                     Source
                 </Button>
                 <Button variant={'secondary'}>
                     Read The Docs</Button>

             </div>



        </div>
        // <div className='flex flex-col gap-5 items-center justify-center text-center'>








        // </div>
    )
}
