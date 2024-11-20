import { Label } from "@radix-ui/react-label";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { z } from "zod";
import { getOptionalUser } from "../auth.server";
import type { ActionFeedback } from "~/components/FeedbackComponent";
import { AlertFeedback } from "~/components/FeedbackComponent";
import { Icons } from "~/components/icons";
import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Votre adresse email est requise.",
      invalid_type_error: "Vous devez fournir une adresse email valide",
    })
    .email({
      message: "Vous devez fournir une adresse email valide",
    }),
});

export const feedbackSchema = z.object({
  message: z.string(),
  error: z.boolean(),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getOptionalUser({ request });

  if (user) {
    // L'utilisateur est connecté
    return redirect("/");
  }
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // 1. On récupère les informations du formulaire.
    const formData = await request.formData();
    const jsonData = Object.fromEntries(formData);
    const parsedJson = forgotPasswordSchema.safeParse(jsonData);

    if (parsedJson.success === false) {
      const { error } = parsedJson;

      return json<ActionFeedback>({
        error: true,
        message: error.errors.map((err) => err.message).join(", "),
      });
    }

    // 2. On appelle notre API Nest avec les données du formulaire
    const response = await fetch(
      `${process.env.BACKEND_URL}/auth/request-reset-password`,
      {
        method: "POST",
        body: JSON.stringify(parsedJson.data),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 3. En cas de succès, on récupère le token pour authentifier l'utilisateur connecté.
    const { error, message } = feedbackSchema.parse(await response.json());
    return json<ActionFeedback>({
      error,
      message,
    });
  } catch (error) {
    let err = error as Error;
    return json<ActionFeedback>({
      error: true,
      message: err.message,
    });
  }
};

const ForgotPasswordForm = () => {
  const formFeedback = useActionData<ActionFeedback>();
  const isLoading = useNavigation().state !== "idle";

  return (
    <>
      <div className="container relative flex-col items-center justify-center lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Récupération du mot de passe
            </h1>
            <p className="text-sm text-muted-foreground">
              Récupérez votre mot de passe
            </p>
          </div>

          {/* FOrm */}
          <div className={"grid gap-6"}>
            <Form method="POST">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email-forgot"
                    name="email"
                    placeholder="Adresse email"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    required
                    disabled={isLoading}
                  />
                </div>

                <AlertFeedback feedback={formFeedback} />
                <Button>
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Récupérer mon mot de passe
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
