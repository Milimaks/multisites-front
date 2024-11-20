import { redirect } from "@remix-run/node";
import { z } from "zod";
import { getSession, getUserToken, logout } from "~/session.server";

const getAuthenticadUserSchema = z.object({
  email: z.string().email(),
  id: z.string(),
  firstName: z.string(),
  firstFreePremium: z.boolean(),
  isFreePremium: z.boolean(),
});

export const getOptionalUser = async ({ request }: { request: Request }) => {
  const userToken = await getUserToken({ request });
  if (!userToken) {
    return null;
  }
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    return getAuthenticadUserSchema.parse(data);
  } catch (error) {
    console.error(error);
    throw await logout({ request });
  }
};

export async function requireAuthCookie(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userId")) {
    throw redirect("/");
  }

  const user = await getOptionalUser({ request });

  if (!user) {
    throw redirect("/");
  }
  return user;
}

export const requireUser = async ({ request }: { request: Request }) => {
  const user = await getOptionalUser({ request });
  if (user) {
    return user;
  }
  throw await logout({ request });
};
