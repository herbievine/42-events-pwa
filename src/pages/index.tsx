import { createRoute,  } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { useUser } from "../hooks/use-user";
import { useEvents } from "../hooks/use-events";

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexPage,
});

function IndexPage() {
	const { user } = useUser()
	const { events } = useEvents()

	if (!user) {
		return (
			<div>Not logged in
				<a href="/login">login</a>
			</div>
		)
	}

	console.log(events);

  return (
    <div className="flex flex-col space-y-6">
			<div className="p-2 flex justify-between items-center">
			<h1>events for {user.campus[0].name}</h1>
			<button
				onClick={() => {
					localStorage.removeItem('token')
					window.location.reload()
				}}
			>
				logout
			</button>
			</div>
			{events && events.length > 0 && (
				<div className="mx-auto w-full max-w-3xl flex flex-col space-y-4">
					{events
						.sort((a: Record<any, any>, b: Record<any, any>) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
						.map((event: Record<any, any>) => (
							<div key={event.id} className="bg-white p-4 rounded-md shadow-md">
								<h2>{event.name}</h2>
								<p>{event.description}</p>
								<span className="text-red-500">{event.created_at}</span>
							</div>
						))
					}
				</div>
			)}
		</div>
  );
}
