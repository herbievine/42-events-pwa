import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import dayjs from "dayjs";
import { z } from "zod";
import { cn } from "../../lib/cn";
import { fetcher } from "../../lib/fetcher";
import { type EventWithRead } from "../../schema/event";
import { trim } from "../../lib/text";

type CardProps = {
  event: EventWithRead;
  classname?: string;
};

export function Card({ event, classname }: CardProps) {
  const search = useSearch({
    from: "/feed/",
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
            has_read: notification.has_read ? false : true,
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

  return (
    <Link
      to="/feed/$eventId"
      params={{
        eventId: event.event_id + "",
      }}
      className={cn("flex flex-col", classname)}
    >
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <div className="w-full flex justify-between items-center">
            <span className="font-semibold w-1/2">{event.name}</span>
            {/* <span className="text-neutral-500"> - </span> */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold whitespace-nowrap text-neutral-500">
                {search.sort === "created_at"
                  ? `${dayjs(event.created_at).fromNow()}`
                  : `${dayjs(event.begin_at).fromNow()}`}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  mutate();
                }}
                className="w-full px-3 py-1 flex items-center justify-start space-x-2 rounded-md border border-neutral-300 hover:border-neutral-400 transition-colors duration-300 whitespace-nowrap"
              >
                <span className="font-semibold text-sm text-neutral-700">
                  {event.has_read ? "Unarchive" : "Archive"}
                </span>
              </button>
            </div>
          </div>
        </div>
        <p className="text-sm line-clamp-4 whitespace-pre-wrap">
          {trim(event.description).join("\n")}
        </p>
      </div>
    </Link>
  );
}
