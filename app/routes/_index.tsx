import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { j } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { z } from "zod";
import { getOptionalUser } from "~/auth.server";
import { authenticatedUser, getUserToken } from "~/session.server";
// import {
//   authenticatedUser,
//   commitSession,
//   commitUserToken,
//   getUserToken,
// } from "~/session.server";
// import { getOptionalUser } from "./auth.server";
// import { useOptionalUser } from "~/root";

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

const tokenSchema = z.object({
  access_token: z.string(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ request });
  const isLoggedIn = !!user;
  return json({ isLoggedIn });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // 1. On récupère les données du formulaire
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);
  const parsedJson = loginSchema.parse(jsonData);

  // 2. On appelle notre API Nest avec les données du formulaire
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 3. On récupère le token de l'utilisateur
  const { access_token } = tokenSchema.parse(await response.json());
  return await authenticatedUser({ request, userId: access_token });
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <LoginForm />
    </div>
  );
}

export const LoginForm = () => {
  const data = useLoaderData<typeof loader>();
  const { isLoggedIn } = data;
  return (
    <Form method="POST">
      {isLoggedIn && <p>Vous êtes connecté</p>}
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
