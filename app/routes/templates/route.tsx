import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { LoginForm } from "~/@/components/ui/LoginForm";
import { getOptionalUser } from "~/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getOptionalUser({ request });
  return json({
    firstName: user?.firstName,
    email: user?.email,
  });
}

export default function Templates() {
  const { firstName, email } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>products of {email}</h1>
    </div>
  );
  // ...
}
