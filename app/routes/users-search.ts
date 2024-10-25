// app/routes/api/users-search.ts
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  if (!query) {
    return json(
      { error: "Le paramètre de recherche est requis" },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/users/search?query=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des utilisateurs");
    }

    const users = await response.json();
    return json(users);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};
