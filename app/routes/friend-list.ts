import { json, LoaderFunction } from "@remix-run/node";
import { getUserToken } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userToken = await getUserToken({ request });
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/friend`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des demandes d'amis");
    }

    const data = await response.json();
    const { friends } = data;
    return json(friends);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
