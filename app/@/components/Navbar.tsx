import { Form } from "@remix-run/react";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import ModalCloseWithCross from "./ModalCloseWithCross";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  ListItem,
} from "../components/ui/navigation-menu";
import { Link } from "@remix-run/react";
import { cn } from "../lib/utils";
import React from "react";
import { Button } from "./ui/button";
import { ButtonIconHelp } from "./ui/icon-help";
import { ButtonIconSearch } from "./ui/icon-search";
import { navbarWelcomeData } from "../../data/navbarDatas";

interface NavbarProps {
  icon?: string;
  user?: any;
}

const Navbar: React.FC<NavbarProps> = ({ icon, user }) => {
  const isConnected = !!user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleClick = (e: any) => {
    console.log("clicked");
    setIsModalOpen(!isModalOpen);
  };

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Alert Dialog",
      href: "https://ui.shadcn.com/docs/primitives/alert-dialog",
      description:
        "A modal dialog that interrupts the user with important content and expects a response.",
    },
    {
      title: "Hover Card",
      href: "https://ui.shadcn.com/docs/primitives/hover-card",
      description:
        "For sighted users to preview content available behind a link.",
    },
    {
      title: "Progress",
      href: "https://ui.shadcn.com/docs/primitives/progress",
      description:
        "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
    },
    {
      title: "Scroll-area",
      href: "https://ui.shadcn.com/docs/primitives/scroll-area",
      description: "Visually or semantically separates content.",
    },
    {
      title: "Tabs",
      href: "https://ui.shadcn.com/docs/primitives/tabs",
      description:
        "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
    },
    {
      title: "Tooltip",
      href: "https://ui.shadcn.com/docs/primitives/tooltip",
      description:
        "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
    },
  ];

  return (
    <>
      <NavigationMenu className="justify-between min-h-[72px] fixed top-0 left-0 right-0 z-50 bg-white">
        <NavigationMenuList>
          <Link to="/">
            <img
              src="/image/logo-canva.svg.png"
              alt="Canva Logo"
              className="w-16 h-auto"
            />
          </Link>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Accueil</NavigationMenuTrigger>
            <NavigationMenuContent>
              {navbarWelcomeData.map((data, index) => (
                <ul
                  className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
                  key={index}
                >
                  <a
                    href={data?.link}
                    className="font-semibold text-base font-heading leading-none"
                  >
                    {data.title}
                  </a>
                  {data.content?.map((item, index) => (
                    <div key={index}>
                      <a
                        href={item.href}
                        className="text-muted-foreground font-base line-clamp-2 text-sm leading-snug"
                      >
                        {item.description}
                      </a>
                    </div>
                  ))}
                </ul>
              ))}

              {/* {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))} */}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Entreprise</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>{" "}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Enseignement</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>{" "}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Abonnement et tarifs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>{" "}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Découvrir</NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>{" "}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>

        {user ? (
          <Form method="POST" action="logout">
            <button type="submit">Se déconnecter</button>
          </Form>
        ) : (
          <>
            <NavigationMenuList>
              <ButtonIconHelp />
              <ButtonIconSearch />
              <Button
                variant="outline"
                onClick={handleClick}
                className="pr-8 pl-8"
              >
                Se connecter
              </Button>
              <Button
                variant="canva"
                onClick={handleClick}
                className="pr-8 pl-8"
              >
                S'inscrire
              </Button>
              <ModalCloseWithCross isOpen={isModalOpen} onClose={toggleModal}>
                <LoginForm />
              </ModalCloseWithCross>{" "}
            </NavigationMenuList>
          </>
        )}
      </NavigationMenu>
    </>
  );
};

export default Navbar;
