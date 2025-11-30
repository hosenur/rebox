import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/databases/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_databases/"!</div>
}
