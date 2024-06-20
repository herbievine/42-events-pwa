import { Link, createRoute, useParams } from "@tanstack/react-router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../../lib/fetcher";
import { eventSchema } from "../../schema/event";
import { Loading } from "../../components/loading";
import { feedLayout } from "./_layout";
import { ChevronIcon } from "../../assets/chevron";

dayjs.extend(relativeTime);

export const eventRoute = createRoute({
  getParentRoute: () => feedLayout,
  path: "/$eventId",
  component: EventPage,
});

function EventPage() {
  const { eventId } = useParams({
    from: "/feed/$eventId",
  });

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      return fetcher(
        `${import.meta.env.VITE_API_URL}/events/${eventId}`,
        eventSchema,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  });

  function when() {
    if (!event) {
      return "";
    }

    const begin = dayjs(event.begin_at);
    const end = dayjs(event.end_at);

    if (begin.isSame(end, "day")) {
      return `${begin.format("DD/MM/YYYY HH:mm")} - ${end.format("HH:mm")}`;
    }

    return `${begin.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;
  }

  if (isLoading || !event) {
    return <Loading className="h-[calc(100vh_-_4rem_-_49px)]" />;
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh_-_4rem_-_49px)]">
      <div className="py-2 px-4 flex items-center space-x-4 border-b border-neutral-300">
        <Link
          to="/feed"
          search={{
            sort: "created_at",
          }}
          className="px-3 py-1 flex items-center justify-start space-x-2 rounded-md border border-neutral-300 hover:border-neutral-400 transition-colors duration-300 whitespace-nowrap"
        >
          <ChevronIcon className="w-4 h-4 fill-neutral-700 rotate-90" />
          <span className="font-semibold text-sm text-neutral-700">Back</span>
        </Link>
        <h2 className="font-semibold text-neutral-700">{event.name}</h2>
      </div>
      <div className="flex flex-col divide-y divide-neutral-300">
        <div className="p-4">
          <div className="flex flex-col space-y-2">
            {event.location && (
              <span className="text-neutral-700">Where: {event.location}</span>
            )}
            <span className="text-neutral-700">When: {when()}</span>
            <span className="text-neutral-700">
              Participants: {event.attendees}
              {event.max_attendees ? ` / ${event.max_attendees}` : ""}
            </span>
          </div>
          {/* {search.sort === "created_at" && (
        <div
          className={cn(
            "p-1 flex justify-between items-center",
            search.sort === "created_at" ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          <button
            type="button"
            onClick={() => mutate()}
            className="flex-1 px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 rounded-md"
          >
            {event.has_read ? "Mark as unread" : "Mark as read"}
          </button>
          <button
          type="button"
          className="flex-1 px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Add to calendar
        </button>
          {search.sort === "created_at" && (
            <button
              disabled
              type="button"
              className="flex-1 px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 rounded-md"
            >
              Subscribe
            </button>
          )}
        </div>
      )} */}
        </div>
        <div className="p-4 whitespace-pre-wrap">{event.description}</div>
      </div>
    </div>
  );
}
