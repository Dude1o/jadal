import { sidebarItems } from "@/lib/sidebar-data";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp, LogOutIcon, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {
  cn,
  getTranslation,
  isMenuItemActive,
  isRTL,
  isSubMenuItemActive,
  rtlAuto,
  rtlChevron,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import Logout from "../features/auth/logout";
import { useDialogStore } from "@/services";
import { useRef, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { authApi } from "@/services/api";

import { NavPill } from "./nav-pill";

import logo from "@/assets/new-logo.png";

const AppSidebar = () => {
  const { state, setOpenMobile } = useSidebar();
  const { pathname, search } = useLocation();
  const { i18n, t } = useTranslation();
  const dialog = useDialogStore();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const [, setDialogError] = useState<string | undefined>();
  const user = useAuthStore.getState().user;

  // The pill measures against this list and re-measures whenever the route
  // changes, which is what makes it slide rather than blink.
  const navRef = useRef<HTMLDivElement>(null);
  const activeKey = `${pathname}?${
    typeof search === "string"
      ? search
      : new URLSearchParams(search as never).toString()
  }`;

  // Helper to get search params while preserving view
  const getSearchWithView = (newSearch?: Record<string, any>) => {
    // Get current search params to check for view
    const currentParams = new URLSearchParams(
      typeof search === "string"
        ? search
        : new URLSearchParams(search).toString(),
    );
    const currentView = currentParams.get("view") || "cards";

    if (!newSearch) {
      // Parent item: clear filters but keep view
      return { view: currentView };
    }

    // Submenu item: merge filters but keep view
    return {
      view: currentView,
      ...newSearch,
    };
  };

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      side={i18n.language === "en" ? "left" : "right"}
    >
      <SidebarHeader className="relative z-10 px-3 py-5">
        <Link
          to="/"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.08]">
            <img
              src={logo}
              alt=""
              aria-hidden
              className="size-7 shrink-0 object-contain"
            />
          </span>
          <span className="truncate text-[length:var(--text-title)] font-extrabold text-rail-fg group-data-[collapsible=icon]:hidden">
            {getTranslation(t, "auth.login.brand")}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="no-scrollbar relative z-10 px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <div ref={navRef} className="relative">
              {/* Sliding orange indicator: one element, not a class per row */}
              {state !== "collapsed" && (
                <NavPill containerRef={navRef} activeKey={activeKey} />
              )}
              <SidebarMenu className="gap-1">
                {sidebarItems.map((item) => {
                  const isActive = isMenuItemActive(pathname, search, item);

                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={false}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        {item.subItems ? (
                          <>
                            {/* Parent row */}
                            <div className="flex items-center w-full">
                              {/* Navigation */}
                              <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                data-nav-active={isActive || undefined}
                                className="flex-1"
                              >
                                <Link
                                  to={item.url}
                                  search={getSearchWithView()}
                                  onClick={() => setOpenMobile(false)}
                                  className="flex w-full items-center gap-3"
                                >
                                  {item.icon && <item.icon />}
                                  <span>{getTranslation(t, item.title)}</span>
                                </Link>
                              </SidebarMenuButton>

                              {/* Chevron toggle */}
                              {state !== "collapsed" && (
                                <CollapsibleTrigger asChild>
                                  <button
                                    type="button"
                                    className={cn(
                                      rtlAuto(),
                                      "relative z-10 shrink-0 cursor-pointer rounded-full p-2 text-rail-fg-muted transition-colors duration-150 ease-in-out hover:bg-white/[0.07] hover:text-[#D5E2F2]",
                                    )}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ChevronDown
                                      size={16}
                                      className={cn(
                                        "transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180",
                                        rtlChevron(),
                                      )}
                                    />
                                  </button>
                                </CollapsibleTrigger>
                              )}
                            </div>

                            {/* Submenu */}
                            <CollapsibleContent>
                              <SidebarMenuSub className="mt-1 gap-0.5 py-0">
                                {item.subItems.map((subItem) => {
                                  const isSubActive = isSubMenuItemActive(
                                    pathname,
                                    search,
                                    subItem,
                                  );

                                  return (
                                    <SidebarMenuSubItem key={subItem.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        data-nav-active={
                                          isSubActive || undefined
                                        }
                                      >
                                        <Link
                                          to={subItem.url}
                                          search={getSearchWithView(
                                            subItem.search,
                                          )}
                                          onClick={() => setOpenMobile(false)}
                                          className="flex w-full items-center gap-3"
                                        >
                                          {subItem.icon && <subItem.icon />}
                                          <span>
                                            {getTranslation(t, subItem.title)}
                                          </span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </>
                        ) : (
                          /* Normal menu item */
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            data-nav-active={isActive || undefined}
                          >
                            <Link
                              to={item.url}
                              search={getSearchWithView(item.search)}
                              onClick={() => setOpenMobile(false)}
                              className="flex w-full items-center gap-3"
                            >
                              {item.icon && <item.icon />}
                              <span>{getTranslation(t, item.title)}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                })}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative z-10 px-3 pb-4">
        <SidebarMenuItem className="list-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-2 rounded-[18px] bg-white/[0.06] px-3 py-2.5 text-start transition-colors duration-150 ease-in-out hover:bg-white/[0.11]",
                  isRTL() && "flex-row-reverse",
                )}
              >
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-2.5",
                    isRTL() && "flex-row-reverse",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-rail-accent/20 text-[length:var(--text-small)] font-bold text-rail-accent">
                    {(user?.name ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                  <span
                    className={cn("min-w-0", state === "collapsed" && "hidden")}
                  >
                    <span className="block truncate text-[length:var(--text-caption)] font-bold text-rail-fg">
                      {user?.name}
                    </span>
                    <span className="block truncate text-[length:var(--text-small)] font-semibold text-rail-fg-muted">
                      {user?.role
                        ? getTranslation(t, `users.roles.${user.role}`)
                        : ""}
                    </span>
                  </span>
                </span>
                <ChevronUp
                  size={16}
                  className={cn(
                    "shrink-0 text-rail-fg-muted",
                    state === "collapsed" && "hidden",
                  )}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL() ? "start" : "end"}>
              <DropdownMenuItem asChild>
                <Link
                  to="/settings"
                  search={getSearchWithView()}
                  className={cn(
                    "flex items-center gap-2",
                    isRTL() && "flex-row-reverse",
                  )}
                >
                  <Settings2 />
                  <span>
                    {getTranslation(t, "navigation.sidebar.settings")}
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  "group flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive",
                  isRTL() && "flex-row-reverse",
                )}
                onClick={() => {
                  setDialogError(undefined);

                  const openDialog = (error?: string) => {
                    dialog.close("logout");
                    setDialogError(error);

                    setTimeout(() => {
                      dialog.open({
                        id: "logout",
                        title: getTranslation(t, "auth.logout.title"),
                        size: "sm",
                        closeOnOutsideClick: true,
                        children: <Logout error={error} />,
                        actions: [
                          {
                            label: getTranslation(t, "common.actions.cancel"),
                            variant: "ghost",
                            onClick: () => {
                              setDialogError(undefined);
                            },
                            closeOnClick: true,
                          },
                          {
                            label: getTranslation(
                              t,
                              "navigation.sidebar.logout",
                            ),
                            variant: "destructive",
                            closeOnClick: false,
                            onClick: async () => {
                              try {
                                const { accessToken } = useAuthStore.getState();
                                if (accessToken) {
                                  // Call logout API with token
                                  await authApi.logout({ token: accessToken });
                                }

                                // Clear auth state
                                logout();
                                dialog.close("logout");
                                setDialogError(undefined);
                                navigate({ to: "/login" });
                              } catch (err: any) {
                                const errorMsg =
                                  err?.data?.message ||
                                  getTranslation(t, "auth.logout.failed");
                                openDialog(errorMsg);
                              }
                            },
                          },
                        ],
                      });
                    }, 0);
                  };

                  openDialog();
                }}
              >
                <LogOutIcon />
                <span>{getTranslation(t, "navigation.sidebar.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
