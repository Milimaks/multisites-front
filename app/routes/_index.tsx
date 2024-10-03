import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/react";
import { z } from "zod";
import { useOptionalUser } from "~/root";
import { authenticatedUser } from "~/session.server";
import { tokenSchema } from "./register";
import { Button } from "~/@/components/ui/button";

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
    const jsonData = Object.fromEntries(formData);
    const parsedJson = loginSchema.parse(jsonData);
    // 2. On appelle notre API Nest avec les données du formulaire
    const response = await fetch(`http://localhost:3000/auth/login`, {
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
    <>
      <main className="mt-16 pr-8 pl-8">
        <section
          id="hero-section"
          className="flex justify-center flex-col items-center gap-8"
        >
          <h1 className="text-5xl font-bold text-center">
            Qu'allez vous créer aujourd'hui ?
          </h1>

          <p className="text-center text-xl text-gray-500">
            Avec Canva, créez, partagez et imprimez facilement des designs
            professionnels.
          </p>
          <Button variant={"canva"} className="">
            Commencer à créer
          </Button>
        </section>
      </main>
    </>
  );
}
