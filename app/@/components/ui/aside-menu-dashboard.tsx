import { Link, useLocation } from "@remix-run/react";
import {
  FolderDot,
  FolderOpenDot,
  Home,
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const AsideMenuDashboard = ({ children }: any) => {
  const actualUrl = useLocation();

  const isActive = (path: string): boolean => actualUrl.pathname === path;
  return (
    <div className="flex">
      <aside className="flex inset-y-0 sticky h-dvh">
        <div
          id="asideMenu"
          className="  left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex"
        >
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 ">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/projects"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/projects")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {actualUrl.pathname !== "/projects" ? (
                    <FolderDot className="h-5 w-5" />
                  ) : (
                    <FolderOpenDot className="h-5 w-5" />
                  )}
                  <span className="sr-only">Projects</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Projects</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/products"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8   ${
                    isActive("/products")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/customers"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/customers")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/analytics"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/analytics")
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/settings"
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${
                    isActive("/settings")
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </nav>
        </div>
        <div id="asideMenuInfo" className="p-2">
          coucou
        </div>
      </aside>
      <div id="pageContent" className="p-2 flex-1">
        {children}
      </div>
    </div>
  );
};

export default AsideMenuDashboard;
