import { User } from "~/lib/user";
import { getUserToken } from "~/session.server";

export async function getFriends(request: Request): Promise<User[]> {
  const userToken = await getUserToken({ request });

  const response = await fetch(`${process.env.BACKEND_URL}/friend`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des amis");
  }

  const data = await response.json();
  return data.friends;
}
