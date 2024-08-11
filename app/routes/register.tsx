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

  if (!parsedData.success) {
    const { error } = parsedData;
    return json({
      error: true,
      message: error.errors.map((err) => err.message).join(", "),
    });
  }

  // 2. On appelle notre API Nest avec les données du formulaire
  const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    body: JSON.stringify(parsedData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 3. On récupère le token de l'utilisateur
  const { access_token, message, error } = tokenSchema.parse(
    await response.json()
  );

  if (error) {
    return json({ error, message });
  }
  if (access_token) {
    return await authenticatedUser({ request, userId: access_token });
  }
  return json({
    error: true,
    message: "Une erreur est survenue lors de l'inscription",
  });
};

export default function RegisterForm() {
  // retrieve data from the server
  const formFeedback = useActionData<typeof action>();
  return (
    <>
      <Form method="POST">
        <label>
          <span>email:</span>
          <input type="email" name="email" />
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
