import { Clock, Code, Command, Cube, Database, Feather } from "@phosphor-icons/react/dist/ssr"
import { Badge } from "./ui/badge"

interface Feature {
    id: number
    name: string
    description: string
    icon: JSX.Element
}

const iconSize = 25

const FeaturesData: Feature[] = [
    {
        id: 1,
        name: 'Databases',
        description:
            'Rebox supports multiple databases like MySQL, PostgreSQL, Redis and MongoDB.',
        icon: <Database size={iconSize} />,
    },
    {
        id: 2,
        name: 'Apps',
        description:
            'Host any web application, Next.js, React, Nodejs and more with Rebox.',
        icon: <Code size={iconSize} />,
    },
    {
        id: 3,
        name: 'Docker Images',
        description:
            'Deploy your docker images with ease, Rebox supports Docker images.',
        icon: <Cube size={iconSize} />,
    },
    {
        id: 4,
        name: 'Responsive',
        description:
            'SyntaxUI components are designed to be responsive and work seamlessly across devices.',
        icon: <Feather size={iconSize} />,
    },
    {
        id: 5,
        name: 'Accessible',
        description:
            'SyntaxUI prioritizes accessibility, ensuring that your components are usable by everyone.',
        icon: <Command size={iconSize} />,
    },
    {
        id: 6,
        name: 'Regularly Updated',
        description:
            'SyntaxUI is actively maintained and regularly updated with new features and improvements.',
        icon: <Clock size={iconSize} />,
    },
]

export const FeaturesGrid = () => {
    return (
        <div>
            <div className="mt-8 grid w-full grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {FeaturesData.map((feature) => {
                    return (
                        <div key={feature.id} className="width-fit text-left">
                            <div className="mb-2 w-fit rounded-lg p-1.5 text-center text-white">
                                {feature.icon}
                            </div>
                            <div className="text-md mb-1 font-semibold flex items-center gap-2">
                                {feature.name} <Badge variant={"outline"}>Coming Soon</Badge>
                            </div>
                            <div className="font-regular max-w-sm text-sm text-muted-foreground">
                                {feature.description}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const FeaturesWithHeading = () => {
    return (
        <div className="my-12 flex w-full flex-col items-center justify-center">
            <h1 className="mb-2 max-w-3xl text-center text-2xl font-semibold tracking-tighter text-gray-900 md:text-3xl">
                SyntaxUI is not like any other component library.
            </h1>
            <p className="max-w-sm text-center text-sm text-gray-600">
                SyntaxUI is a free to use, customizable, and highly customizable UI
                component library.
            </p>
            <FeaturesGrid />
        </div>
    )
}

export default FeaturesWithHeading
