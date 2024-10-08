import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { z } from "zod";
import { authenticatedUser } from "~/session.server";
import { getOptionalUser } from "../auth.server";

const registerSchema = z.object({
  email: z
    .string({
      required_error: "Veuillez renseigner votre email",
      invalid_type_error: "Veuillez renseigner un email valide",
    })
    .email({ message: "Veuillez renseigner un email valide" }),
  password: z
    .string({
      required_error: "Veuillez renseigner un mot de passe",
    })
    .min(6, {
      message: "Votre mot de passe doit contenir au moins 6 caractères",
    }),
  firstName: z
    .string({ required_error: "Veuillez renseigner votre prénom" })
    .min(2, {
      message: "Votre prénom doit contenir au moins 2 caractères",
    }),
});

export const tokenSchema = z.object({
  access_token: z.string().optional(),
  message: z.string().optional(),
  error: z.boolean().optional(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ request });
  if (user) {
    return redirect("/");
  }
  return json({});
};
export const action = async ({ request }: ActionFunctionArgs) => {
  // 1. On récupère les données du formulaire
  const formData = await request.formData();
  const jsonData = Object.fromEntries(formData);
  const parsedData = registerSchema.safeParse(jsonData);

  // Vérification des erreurs dans les données du formulaire
  if (!parsedData.success) {
    const { error } = parsedData;
    console.log(error.errors);
    return json({
      error: true,
      message: error.errors.map((err) => err.message).join(", "),
    });
  }

  // 2. On appelle notre API Nest avec les données du formulaire
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    body: JSON.stringify(jsonData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // 3. On récupère la réponse de l'API
  const jsonResponse = await response.json();
  // Vérification des erreurs dans la réponse
  if (!response.ok) {
    return json({
      error: true,
      message:
        jsonResponse.message || "Une erreur est survenue lors de l'inscription",
    });
  }

  const { access_token, error } = jsonResponse;

  if (error || !access_token) {
    return json({
      error: true,
      message: jsonResponse.message || "Inscription échouée",
    });
  }

  // Authentification de l'utilisateur si tout s'est bien passé
  return await authenticatedUser({ request, userId: access_token });
};

export default function RegisterForm() {
  // retrieve data from the server
  const formFeedback = useActionData<typeof action>();
  return (
    <>
      <Form method="POST">
        <label>
          <span>email:</span>
          <input type="email" name="email" className="" />
        </label>
        <label>
          <span>firstname</span>
          <input type="text" name="firstName" />
        </label>
        <label>
          <span>password:</span>
          <input type="password" name="password" />
        </label>
        {formFeedback?.message && (
          <p style={{ color: formFeedback?.error ? "red" : "green" }}>
            {formFeedback.message}
          </p>
        )}
        <button type="submit">Créez votre compte</button>
      </Form>
    </>
  );
}
