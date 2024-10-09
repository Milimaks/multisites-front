import { Link, useLocation } from "@remix-run/react";
import {
  FolderDot,
  FolderOpenDot,
  Home,
  LineChart,
  Package,
  Plus,
  Settings,
  Users2,
} from "lucide-react";
import { Button } from "./button";
import PremiumLogo from "./logo-premium";

const AsideMenuDashboard = ({ children }: any) => {
  const actualUrl = useLocation();

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
                <LineChart className="h-5 w-5 text-can-primary" />
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
          <Button className="mt-4 h-fit" variant={"outline"}>
            <PremiumLogo color="#fdbc68" />
            <span className="text-xs whitespace-normal break-words max-w-full">
              Obtenir un nouvel essai gratuit
            </span>
          </Button>
        </div>
      </aside>
      <main id="pageContent" className="p-2 flex-1">
        {children}
      </main>
    </div>
  );
};

export default AsideMenuDashboard;
