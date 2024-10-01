import { Form } from "@remix-run/react"
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { authClient } from "~/lib/auth.client"

export default function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signIn = async () => {
        console.log("pressed")
        await authClient.signIn.social({
            provider: 'github'
        })

    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Form onSubmit={signIn} className="flex flex-col gap-2 w-96">
                <Button
                    type="submit"
                >
                    Sign In
                </Button>
            </Form>
        </div>
    )
}