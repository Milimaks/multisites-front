import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
import { z } from "zod";
import ConnectedUserIndex from "~/@/components/index/ConnectedUserIndex";
import DisconnectedUserIndex from "~/@/components/index/DisconnectedUserIndex";
import { getOptionalUser } from "~/auth.server";
import { useOptionalUser } from "~/root";
import { authenticatedUser, getUserToken } from "~/session.server";
import { tokenSchema } from "./register";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
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
        console.log(response);
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

export default function Index() {
  const user = useOptionalUser();
  const isConnected = !!user;
  return (
    <>{isConnected ? <ConnectedUserIndex /> : <DisconnectedUserIndex />}</>
  );
}
