import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { ActionFeedback, AlertFeedback } from "./FeedbackComponent";
import { Icons } from "./icons";

export function LoginForm() {
  const isLoading = useNavigation().state !== "idle";
  const formFeedback = useActionData<ActionFeedback>();
  return (
    <Card className="mx-auto max-w-sm min-w-96">
      <CardHeader className="flex-col">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter yo to login to your account</CardDescription>
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
            <AlertFeedback feedback={formFeedback} />
          </div>
          <Button
            type="submit"
            name="formType"
            value="login"
            className="w-full"
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
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
