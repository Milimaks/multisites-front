import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, Link } from "@remix-run/react";
import { z } from "zod";
import { useOptionalUser } from "~/root";
import { authenticatedUser } from "~/session.server";
import { tokenSchema } from "./register";
import { Button } from "~/@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/@/components/ui/card";
import { Label } from "~/@/components/ui/label";
import { Input } from "~/@/components/ui/input";

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
        <LoginForm />
      )}
    </div>
  );
}

export function LoginForm() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post" className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
