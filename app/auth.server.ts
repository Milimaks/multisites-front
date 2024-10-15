import { z } from "zod";
import { getUserToken, logout } from "~/session.server";

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
