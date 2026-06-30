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
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronUp,
  CircleUserIcon,
  LogOutIcon,
  Plus,
  Settings2,
  User2,
} from "lucide-react";
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
import { useMergeSearch } from "@/lib/utils";

const AppSidebar = () => {
  const { state, setOpenMobile } = useSidebar();
  const { pathname, search } = useLocation();
  const { i18n, t } = useTranslation();
  const dialog = useDialogStore();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const mergeSearch = useMergeSearch();

  const [dialogError, setDialogError] = useState<string | undefined>();
  const user = useAuthStore.getState().user;

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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">{getTranslation(t, "auth.login.brand")}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="self-center" />

      <SidebarContent className="no-scrollbar">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
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
                              className="flex-1"
                            >
                              <Link
                                to={item.url}
                                search={getSearchWithView()}
                                onClick={() => setOpenMobile(false)}
                                className="flex items-center gap-2 w-full"
                              >
                                {item.icon && <item.icon className="h-4 w-4" />}
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
                                    "p-2 text-muted-foreground hover:text-foreground",
                                  )}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ChevronDown
                                    size={18}
                                    className={cn(
                                      "transition-transform group-data-[state=open]/collapsible:rotate-180",
                                      rtlChevron(),
                                      "hover:text-accent-foreground hover:bg-accent hover:rounded-2xl",
                                    )}
                                  />
                                </button>
                              </CollapsibleTrigger>
                            )}
                          </div>

                          {/* Submenu */}
                          <CollapsibleContent>
                            <SidebarMenuSub>
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
                                      className="
                                  text-sidebar-foreground
                                  [&>svg]:text-sidebar-foreground

                                  hover:text-sidebar-accent-foreground
                                  hover:[&>svg]:text-sidebar-accent-foreground

                                  data-[active=true]:text-sidebar-primary-foreground
                                  data-[active=true]:[&>svg]:text-sidebar-primary-foreground
                                "
                                    >
                                      <Link
                                        to={subItem.url}
                                        search={getSearchWithView(
                                          subItem.search,
                                        )}
                                        onClick={() => setOpenMobile(false)}
                                        className="flex items-center gap-2 w-full"
                                      >
                                        {subItem.icon && (
                                          <subItem.icon className="h-4 w-4" />
                                        )}
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
                        <div className="flex items-center w-full">
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="flex-1"
                          >
                            <Link
                              to={item.url}
                              search={getSearchWithView(item.search)}
                              onClick={() => setOpenMobile(false)}
                              className="flex items-center gap-2 w-full"
                            >
                              {item.icon && <item.icon className="h-4 w-4" />}
                              <span>{getTranslation(t, item.title)}</span>
                            </Link>
                          </SidebarMenuButton>

                          {item.hasPlusIcon && state !== "collapsed" && (
                            <button
                              type="button"
                              className={cn(
                                rtlAuto(),
                                "p-2 text-muted-foreground hover:text-foreground",
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Plus
                                size={18}
                                className={cn(
                                  "transition-transform",
                                  rtlChevron(),
                                  "hover:text-accent-foreground hover:bg-accent hover:rounded-2xl",
                                )}
                              />
                            </button>
                          )}
                        </div>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="self-center" />

      <SidebarFooter>
        <SidebarMenuItem className="list-none">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                className={cn(
                  "flex items-center w-full gap-2 justify-between", // gap for icon+name, justify-between for chevron
                  isRTL() && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isRTL() && "flex-row-reverse",
                  )}
                >
                  <User2 size={18} />
                  <span className={`${state === "collapsed" ? "hidden" : ""}`}>
                    {user?.name}
                  </span>
                </div>
                <ChevronUp />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRTL() ? "start" : "end"}>
              <DropdownMenuItem
                className={cn(
                  "flex items-center gap-2",
                  isRTL() && "flex-row-reverse",
                )}
              >
                <CircleUserIcon />
                <span>{getTranslation(t, "navigation.sidebar.account")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-muted hover:text-foreground"
                asChild
              >
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
                  "group flex items-center gap-2",
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
                <LogOutIcon className="transition-colors group-hover:text-red-600" />
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
