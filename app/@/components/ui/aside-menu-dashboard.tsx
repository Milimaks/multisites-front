import { Form, Link, useLocation } from "@remix-run/react";
import {
  Bell,
  ChevronDown,
  FolderDot,
  FolderOpenDot,
  Home,
  LineChart,
  MessageCircleMore,
  Package,
  Plus,
  Search,
  Settings,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ButtonIcon } from "./button-icon";
import PremiumLogo from "./logo-premium";
import "/style/searchBar.css";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/@/components/ui/popover";

type AsideMenuDashboardProps = {
  children: any;
  user: any;
};

const AsideMenuDashboard = ({ children, user }: AsideMenuDashboardProps) => {
  const scrollDivRef = React.useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const actualUrl = useLocation();
  const { isFreePremium } = user;

  // Check if the user is scrolling to add shadow to the header
  useEffect(() => {
    const onScroll = () => {
      if (scrollDivRef.current) {
        const y = scrollDivRef.current.scrollTop;
        setIsScrolled(y > 0);
      }
    };

    const scrollDiv = scrollDivRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener("scroll", onScroll);
    }

    return () => {
      if (scrollDiv) {
        scrollDiv.removeEventListener("scroll", onScroll);
      }
    };
  }, []);

  const userImage = "/image/profile-user.jpeg";

  const isActive = (path: string): boolean => actualUrl.pathname === path;
  return (
    <div className="flex">
      <aside className="flex inset-y-0 sticky h-dvh  bg-can-main">
        <div
          id="asideMenu"
          className="bg-can-main left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"
        >
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 ">
            <div className="flex flex-col items-center ">
              <Link
                to="/"
                className={`flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  isActive("/") ? "bg-can-foreground " : "text-muted-foreground"
                }`}
              >
                <Home
                  className={`w-5 ${
                    isActive("/") ? "text-can-primary" : "text-can-icon"
                  }`}
                />
              </Link>
              <span
                className={`text-xs ${
                  isActive("/") ? "text-focus-can" : "text-subtitle-can"
                }`}
              >
                Accueil
              </span>
            </div>
            <div className="flex flex-col items-center ">
              <Link
                to="/projects"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  isActive("/projects")
                    ? "bg-can-foreground "
                    : "text-muted-foreground"
                }`}
              >
                {actualUrl.pathname !== "/projects" ? (
                  <FolderDot
                    className={`w-5 ${
                      isActive("/projects")
                        ? "text-can-primary"
                        : "text-can-icon"
                    }`}
                  />
                ) : (
                  <FolderOpenDot
                    className={`w-5 ${
                      isActive("/projects")
                        ? "text-can-primary"
                        : "text-can-icon"
                    }`}
                  />
                )}
              </Link>
              <span
                className={`text-xs ${
                  isActive("/projects") ? "text-focus-can" : "text-subtitle-can"
                }`}
              >
                Projets
              </span>
            </div>
            <div className="flex flex-col items-center ">
              <Link
                to="/templates"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8   ${
                  isActive("/templates")
                    ? "bg-can-foreground "
                    : "text-muted-foreground"
                }`}
              >
                <Package
                  className={`w-5 ${
                    isActive("/templates")
                      ? "text-can-primary"
                      : "text-can-icon"
                  }`}
                />
              </Link>
              <span
                className={`text-xs ${
                  isActive("/templates")
                    ? "text-focus-can"
                    : "text-subtitle-can"
                }`}
              >
                Modèles
              </span>
            </div>

            <div className="flex flex-col items-center ">
              <Link
                to="/brand"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  isActive("/brand")
                    ? "bg-can-foreground "
                    : "text-muted-foreground"
                }`}
              >
                <Users2
                  className={`w-5 ${
                    isActive("/brand") ? "text-can-primary" : "text-can-icon"
                  }`}
                />
              </Link>
              <span
                className={`text-xs ${
                  isActive("/brand") ? "text-focus-can" : "text-subtitle-can"
                }`}
              >
                Marque
              </span>
            </div>
            <div className="flex flex-col items-center ">
              <Link
                to="/your-apps"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  isActive("/your-apps")
                    ? "bg-can-foreground "
                    : "text-muted-foreground"
                }`}
              >
                <LineChart
                  className={`w-5 ${
                    isActive("/your-apps")
                      ? "text-can-primary"
                      : "text-can-icon"
                  }`}
                />
              </Link>
              <span
                className={`text-xs ${
                  isActive("/your-apps")
                    ? "text-focus-can"
                    : "text-subtitle-can"
                }`}
              >
                Applis
              </span>
            </div>
            <div className="flex flex-col items-center ">
              <Link
                to="/chat"
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                  isActive("/chat")
                    ? "bg-can-foreground "
                    : "text-muted-foreground"
                }`}
              >
                <MessageCircleMore
                  className={`w-5 ${
                    isActive("/chat") ? "text-can-primary" : "text-can-icon"
                  }`}
                />
              </Link>
              <span
                className={`text-xs ${
                  isActive("/chat") ? "text-focus-can" : "text-subtitle-can"
                }`}
              >
                Chat
              </span>
            </div>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Link
              to="/settings"
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                isActive("/settings") ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <Settings className="h-5 w-5 text-can-primary" />
              <span className="sr-only">Settings</span>
            </Link>
          </nav>
        </div>
        <div id="asideMenuInfo" className="p-4 w-56 bg-can-main flex flex-col">
          <span>
            <img src="/image/logo-canva.svg.png" alt="Canva" className="w-16" />
          </span>

          <Button
            variant="canva"
            size="xs"
            className="mt-4 flex justify-center"
          >
            <span>
              <Plus />
            </span>
            <span className="ml-2">Créer un design</span>
          </Button>
          {!isFreePremium && (
            <Form method="post">
              <Button
                className="mt-4 h-fit"
                variant={"outline"}
                type="submit"
                name="formType"
                value="getPremiumTrial"
              >
                <PremiumLogo color="#fdbc68" />
                <span className="text-xs whitespace-normal break-words max-w-full">
                  Obtenir un nouvel essai gratuit
                </span>
              </Button>
            </Form>
          )}
        </div>
      </aside>
      <div className=" h-screen flex-1 bg-can-main p-2 ">
        <div
          ref={scrollDivRef}
          className="flex flex-col overflow-y-auto h-full"
        >
          <main id="pageContent" className=" bg-white rounded-t-md">
            <header
              className={`bg-white rounded-t-md  p-2 h-14 sticky top-0 z-50 ${
                isScrolled ? "shadow-bottom" : ""
              }`}
            >
              <div className="custom-grid gap-4 ">
                <div className="rounded-md hover:border-gray-400 border-solid border search-bar-grid flex items-center h-full ">
                  <Search className="w-5 h-5 text-muted-foreground m-1" />
                  <input
                    type="text"
                    className=" w-full border-none hover:border-none focus:border-none focus:outline-none placeholder-gray-400 text-sm"
                    placeholder="Recherchez votre contenu et du contenu canva"
                  ></input>
                </div>
                <div className="personal-info-grid flex items-center ">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        className="w-8 h-8 flex justify-center items-center"
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <div className="flex items-center justify-center">
                          <Settings className="w-5 h-5" />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Paramètres</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        className="w-8 h-8 flex justify-center items-center"
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <div className="flex items-center justify-center">
                          <Bell className="w-5 h-5" />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                  <Popover>
                    <PopoverTrigger>
                      {" "}
                      <Button variant={"ghost"} className="p-2" asChild>
                        <div>
                          <div className="flex items-center">
                            <span>
                              <img
                                src="/image/profile-user.jpeg"
                                className="rounded-full w-8"
                              ></img>
                            </span>

                            <div className="mr-2 ml-3 flex flex-col items-start">
                              <p className="text-xs">Personnel</p>
                              <span>{`${user.firstName}`}</span>
                            </div>
                            <ChevronDown className="w-4" />
                          </div>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Form method="post" action="/logout">
                        <Button
                          variant="ghost"
                          type="submit"
                          className="w-full"
                        >
                          Se déconnecter
                        </Button>
                      </Form>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </header>
            <section className="p-4 ">{children}</section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AsideMenuDashboard;
