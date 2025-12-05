import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="bg-bg p-4 text-fg">Hello "/_dashboard/new"! This should have bg-bg background.</div>
}
