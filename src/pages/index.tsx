import { createRoute, redirect, useLoaderData,  } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import { cn } from "../lib/cn";

dayjs.extend(relativeTime);

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexPage,
	loader: async () => {
		const token = localStorage.getItem("token");

		if (!token) {
			throw redirect({
				to: "/login"
			})
		}

		const user = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
			headers: {
				"Authorization": `Bearer ${token}`
			}
		}).then(res => {
			if (res.status !== 200) {
				return null
			}

			return res.json()
		})

		if (!user) {
			throw redirect({
				to: "/login"
			})
		}
		
		return {
			user,
		}
	}
});

function IndexPage() {
	const { user } = useLoaderData({
		from: "/"
	})

	const { data: events, isLoading } = useQuery({
		queryKey: ["events"],
		queryFn: async () => {
			const token = localStorage.getItem("token");
	
			if (!token) {
				throw new Error("No token found")
			}
			
			const res = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});
	
			if (res.status !== 200) {
				throw new Error("Failed to fetch user")
			}
	
			return res.json();
		} 
	})

  return (
    <div className="">
			<div className="sticky h-16 top-0 left-0 flex justify-center items-center border-b border-neutral-200 backdrop-blur-sm">
				<div className="px-4 mx-auto max-w-5xl w-full flex justify-between items-center">
					<h1 className="text-lg font-black">42 Events</h1>
					<div className="flex space-x-4 items-center">
						<span className="font-semibold">{user.displayname}</span>
						<img src={user.image.link} alt={`${user.displayname}'s profile picture`} className="w-10 rounded-lg" />
					</div>
				</div>
			</div>
			{events && events.length > 0 && (
				<div className="p-4 mx-auto w-full max-w-5xl flex flex-col space-y-4">
					{events
						.sort((a: Record<any, any>, b: Record<any, any>) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
						.map((event: Record<any, any>) => (
							<Card key={event.id} event={event} />
						))
					}
				</div>
			)}
		</div>
  );
}

type CardProps = {
	event: Record<any, any>
}

function Card({ event }: CardProps) {
	// if same day, return the day with the hours (xx/xx hh:mm - hh:mm). if not same day, return a string with the from XX/XX to the XX/XX
	function when() {
		const begin = dayjs(event.begin_at);
		const end = dayjs(event.end_at);

		if (begin.isSame(end, "day")) {
			return `${begin.format("DD/MM/YYYY HH:mm")} - ${end.format("HH:mm")}`
		}

		return `${begin.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`
	}

	return (
		<div className={cn(
			"flex flex-col divide-y rounded-md border divide-teal-500 border-teal-500",
			event.kind === "association" && "divide-blue-500 border-blue-500",
			event.kind === "extern" && "divide-neutral-500 border-neutral-500",
			event.kind === "hackathon" && "divide-green-500 border-green-500",
			event.kind === "pedago" && "divide-red-500 border-red-500",
		)}>
			<div className="p-4 flex flex-col space-y-2">
				<div className="flex justify-between items-center">
					<h2 className="font-semibold">{event.name}</h2>
					<span className="text-xs font-semibold text-neutral-700">Added {dayjs(event.created_at).fromNow()}</span>
				</div>
				<p className="text-sm">{event.description}</p>
			</div>
			<div className="p-4 flex flex-col space-y-2">
				<span className="text-sm text-neutral-700">Where: {event.location}</span>
				<span className="text-sm text-neutral-700">When: {when()}</span>
				<span className="text-sm text-neutral-700">Participants: {event.nbr_subscribers} / {event.max_people}</span>
			</div>
		</div>
	)
}
