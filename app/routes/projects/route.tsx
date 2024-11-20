import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { LoginForm } from "~/components/ui/LoginForm";
import { getOptionalUser, requireAuthCookie } from "~/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthCookie(request);
  return json({
    firstName: user?.firstName,
    email: user?.email,
  });
}

export default function Projects() {
  const { firstName, email } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Projects of {email}</h1>
      <LoginForm />
      <LoginForm />
      <LoginForm />
      <LoginForm />
      <LoginForm />
    </div>
  );
  // ...
}
