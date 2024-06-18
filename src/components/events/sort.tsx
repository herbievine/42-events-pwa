import { Menu, Transition } from "@headlessui/react";
import { Link, useSearch } from "@tanstack/react-router";
import { FilterIcon } from "../../assets/filter";

const options = [
  {
    label: "Date Added",
    value: "created_at",
  },
  {
    label: "Start Date",
    value: "begin_at",
  },
];

export function Sort() {
  const search = useSearch({
    from: "/feed",
  });

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="w-full px-3 py-1 flex items-center justify-start space-x-2 rounded-md border border-neutral-300 hover:border-neutral-400 transition-colors duration-300">
        <span className="font-semibold text-sm text-neutral-700">
          {options.find((option) => option.value === search.sort)?.label}
        </span>
        <FilterIcon className="w-4 h-4 fill-neutral-700" />
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="z-10 absolute px-1 mt-1 right-0 origin-top-right w-48 rounded-md bg-white border border-neutral-300 divide-y divide-neutral-300 shadow-lg">
          {options.map(({ label, value }) => (
            <Menu.Item
              key={value}
              as={Link}
              to={"/"}
              search={{
                sort: value,
              }}
              className="py-1 block cursor-pointer transition-colors duration-300 ease-in-out"
            >
              <div className="w-full py-0.5 px-2 flex items-center justify-between overflow-hidden rounded-md hover:bg-neutral-100 transition-colors duration-300 ease-in-out">
                <span className="font-semibold text-sm text-neutral-700">
                  {label}
                </span>
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
