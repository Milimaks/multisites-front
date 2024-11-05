import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from "@remix-run/react";
import { z } from "zod";
import AsideMenuDashboard from "./@/components/ui/aside-menu-dashboard";
import { TooltipProvider } from "./@/components/ui/tooltip";
import { getOptionalUser } from "./auth.server";
import "./globals.css";
import { tokenSchema } from "./routes/register";
import { authenticatedUser, getUserToken } from "./session.server";
import { UserProvider } from "./context/userContext";

export type UserType = typeof loader | null;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ request });
  const userToken = await getUserToken({ request });
  return json({ user, userToken });
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // 1. On récupère les informations du formulaire.
    const formData = await request.formData();
    const formType = formData.get("formType");
    if (formType === "getPremiumTrial") {
      const user = await getOptionalUser({ request });
      const userToken = await getUserToken({ request });

      if (!user) {
        throw new Error(
          "Vous devez être connecté pour accéder à cette fonctionnalité"
        );
      }

      const response = await fetch(
        `${process.env.BACKEND_URL}/premium/new-trial`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'essai premium");
      }

      return json({ success: true, message: "Essai premium attribué !", user });
    }

    const jsonData = Object.fromEntries(formData);
    const parsedJson = loginSchema.parse(jsonData);
    // 2. On appelle notre API Nest avec les données du formulaire
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
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
  const data = useLoaderData<typeof loader>();
  const userToken = data?.userToken;
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
      <UserProvider>
        <TooltipProvider>
          <body>
            {user ? (
              <AsideMenuDashboard user={user} userToken={userToken}>
                {children}
              </AsideMenuDashboard>
            ) : (
              children
            )}

            <ScrollRestoration />
            <Scripts />
          </body>
        </TooltipProvider>
      </UserProvider>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
