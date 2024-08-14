import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json } from "@remix-run/react";
import { z } from "zod";
import { useOptionalUser } from "~/root";
import { authenticatedUser } from "~/session.server";
import { tokenSchema } from "./register";
import { LoginForm } from "@/components/ui/LoginForm";

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
    <div className="font-sans p-4">
      {isConnected ? (
        <h1 className="text-3xl">Welcome to {user.firstName}</h1>
      ) : (
        <LoginFormRemix />
      )}
    </div>
  );
}

export const LoginFormRemix = () => {
  return (
    <Form method="POST">
      <label>
        <span>email:</span>
        <input type="email" name="email" />
      </label>
      <label>
        <span>password:</span>
        <input type="password" name="password" />
      </label>
      <button type="submit">Se connecter</button>
    </Form>
  );
};
