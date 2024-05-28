import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import dayjs from "dayjs";
import { z } from "zod";
import { cn } from "../../lib/cn";
import { fetcher } from "../../lib/fetcher";
import { type EventWithRead } from "../../schema/event";

type CardProps = {
  event: EventWithRead;
  classname?: string;
};

export function Card({ event, classname }: CardProps) {
  const search = useSearch({
    from: "/",
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      return fetcher(
        `${import.meta.env.VITE_API_URL}/notifications/${
          event.has_read ? "unread" : "read"
        }/${event.event_id}`,
        z.object({}),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["notifications", search.sort],
      });

      const prev = queryClient.getQueryData<EventWithRead[]>([
        "notifications",
        search.sort,
      ]);

      const optimistic = prev?.map((notification) => {
        if (notification.event_id === event.event_id) {
          return {
            ...notification,
            has_read: true,
          };
        }

        return notification;
      });

      queryClient.setQueryData(["notifications", search.sort], optimistic);

      return { prev };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["notifications", search.sort], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", search.sort],
      });
    },
  });

  function when() {
    const begin = dayjs(event.begin_at);
    const end = dayjs(event.end_at);

    if (begin.isSame(end, "day")) {
      return `${begin.format("DD/MM/YYYY HH:mm")} - ${end.format("HH:mm")}`;
    }

    return `${begin.format("DD/MM/YYYY")} - ${end.format("DD/MM/YYYY")}`;
  }

  return (
    <div
      className={cn(
        "flex flex-col divide-y rounded-md border divide-teal-500 border-teal-500",
        event.type === "association" && "divide-blue-500 border-blue-500",
        event.type === "extern" && "divide-neutral-500 border-neutral-500",
        event.type === "hackathon" && "divide-green-500 border-green-500",
        event.type === "pedago" && "divide-red-500 border-red-500",
        classname
      )}
    >
      <div className="p-4 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">{event.name}</h2>
          <span className="text-xs font-semibold text-neutral-700 whitespace-nowrap">
            {search.sort === "created_at"
              ? `Added ${dayjs(event.created_at).fromNow()}`
              : `Starting ${dayjs(event.begin_at).fromNow()}`}
          </span>
        </div>
        <p className="text-sm line-clamp-3">{event.description}</p>
      </div>
      <div className="p-4 flex flex-col space-y-2">
        {event.location && (
          <span className="text-sm text-neutral-700">
            Where: {event.location}
          </span>
        )}
        <span className="text-sm text-neutral-700">When: {when()}</span>
        <span className="text-sm text-neutral-700">
          Participants: {event.attendees}
          {event.max_attendees ? ` / ${event.max_attendees}` : ""}
        </span>
      </div>
      {search.sort === "created_at" && (
        <div
          className={cn(
            "p-2 grid space-x-2",
            search.sort === "created_at" ? "grid-cols-2" : "grid-cols-1"
          )}
        >
          <button
            type="button"
            onClick={() => mutate()}
            className="px-2 py-1 text-sm text-neutral-700 border border-inherit rounded-md"
          >
            {event.has_read ? "Mark as unread" : "Mark as read"}
          </button>
          {/* <button
          type="button"
          className="px-2 py-1 text-sm text-neutral-700 border border-inherit rounded-md"
        >
          Add to calendar
        </button> */}
          {search.sort === "created_at" && (
            <button
              disabled
              type="button"
              className="px-2 py-1 text-sm text-neutral-700 border border-inherit rounded-md"
            >
              Subscribe
            </button>
          )}
        </div>
      )}
    </div>
  );
}
