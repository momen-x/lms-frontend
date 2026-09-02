"use client";
import { User, ChevronDown, SunMoon, LogOut, Check } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "../../auth/hooks/useLogout";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";
import default_user_image from "@/public/assets/default-user1.png";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/get-axios-error-message";
import { AUTH_ROUTES } from "../../auth/utils/constants";
import { clearUserAiChats } from "../../ai/utils/clear-user-ai-chats";

export function ProfileDropdown() {
  const { data: user } = useGetCurrentUser();
  const { theme, setTheme } = useTheme();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const getInitials = () => {
    if (user?.name) return user.name.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return "GU";
  };
  const userId = user?.id ?? "";
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        clearUserAiChats(userId);
        router.push(AUTH_ROUTES.login);
        router.refresh();
      },
      onError: (error) => {
        console.error("Logout failed:", error);
        toast.error(
          getErrorMessage(error) ?? "Logout failed. Please try again.",
        );
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full px-3 hover:bg-muted/50">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={user?.avatar || default_user_image.src}
            alt={user?.name || "avatar"}
          />
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium">{user?.name || "Guest"}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
        </div>
        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user?.avatar || default_user_image.src}
              alt={user?.name || "avatar"}
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-semibold">
              {user?.name || "Guest"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLinkItem
            href="/profile"
            className="flex cursor-pointer items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuLinkItem>

          {/* Real submenu, opens as a flyout like image 2 */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex cursor-pointer items-center gap-2">
              <SunMoon className="h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className="flex items-center justify-between gap-2"
                  onClick={() => setTheme("light")}
                >
                  Light
                  {theme === "light" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between gap-2"
                  onClick={() => setTheme("dark")}
                >
                  Dark
                  {theme === "dark" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center justify-between gap-2"
                  onClick={() => setTheme("system")}
                >
                  System
                  {theme === "system" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex cursor-pointer items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
