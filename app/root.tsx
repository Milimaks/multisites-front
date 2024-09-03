import {
  Form,
  json,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteLoaderData,
} from "@remix-run/react";
import "./globals.css";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getOptionalUser } from "./auth.server";
import Navbar from "./@/components/Navbar";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ request });
  console.log(user);
  return json({ user });
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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar user={user} />

        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
