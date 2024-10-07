import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import "./globals.css";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getOptionalUser } from "./auth.server";
import Navbar from "./@/components/Navbar";
import { z } from "zod";
import { tokenSchema } from "./routes/register";
import { authenticatedUser } from "./session.server";
import AsideMenuDashboard from "./@/components/ui/aside-menu-dashboard";
import { TooltipProvider } from "./@/components/ui/tooltip";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ request });
  return json({ user });
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // 1. On récupère les informations du formulaire.
    const formData = await request.formData();
    const jsonData = Object.fromEntries(formData);
    const parsedJson = loginSchema.parse(jsonData);
    // 2. On appelle notre API Nest avec les données du formulaire
    const response = await fetch(`http://localhost:3000/auth/login`, {
      method: "POST",
      body: JSON.stringify(parsedJson),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 3. En cas de succès, on récupère le token pour authentifier l'utilisateur connecté.
    const { error, message, access_token } = tokenSchema.parse(
      await response.json()
    );
    if (error && message) {
      return json<any>({ error, message });
    } else if (access_token) {
      return await authenticatedUser({
        request,
        userId: access_token,
      });
    }
    throw new Error("Une erreur inattendue est survenue");
  } catch (error) {
    let err = error as Error;
    return json<any>({
      error: true,
      message: err.message,
    });
  }
};

export const useOptionalUser = () => {
  const data = useRouteLoaderData<typeof loader>("root");
  if (data?.user) {
    return data.user;
  }
  return null;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useOptionalUser();
  const location = useLocation();
  const pathsToHideNavbar = ["/register", "/forgot-password"];
  const shouldHideNavbar = pathsToHideNavbar.includes(location.pathname);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <TooltipProvider>
        <body>
          {user ? (
            <AsideMenuDashboard>{children}</AsideMenuDashboard>
          ) : (
            children
          )}
          <ScrollRestoration />
          <Scripts />
        </body>
      </TooltipProvider>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
