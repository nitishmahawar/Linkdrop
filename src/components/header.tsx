import { Link } from "@tanstack/react-router";
import { LinkIcon } from "lucide-react";
import { UserMenu } from "./user-menu";

export const Header = () => {
  return (
    <header className="h-14 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 border-b w-full">
      <Link
        to="/"
        className="flex items-center justify-center gap-2 font-semibold text-xl"
      >
        <LinkIcon className="size-6" /> <span>Linkdrop</span>
      </Link>
      <UserMenu />
    </header>
  );
};
