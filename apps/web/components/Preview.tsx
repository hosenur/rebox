import React from 'react'
import { ContainerScroll } from './ContainerScroll'

export default function Preview() {
    return (
        <ContainerScroll titleComponent={<TitleComponent />}>
            <img src="https://pbs.twimg.com/media/GDE9Au2W0AAMOR9?format=jpg&name=4096x4096" className='object- w-full h-full rounded-xl' alt="" />
        </ContainerScroll>
    )
}
const TitleComponent = () => {
    return (
        <div>
            <h1 className="text-5xl md:text-8xl  font-bold inline-flex animate-shine bg-[linear-gradient(110deg,#939393,40%,#fff,60%,#939393)] bg-[length:200%_100%] text-transparent bg-clip-text">
                Cakewalked
            </h1>
            <h1 className="text-5xl md:text-8xl  font-bold text-[#939393]">
                Deployments
            </h1>
        </div>
    )
}
