// app/sessions.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "__session",
      secrets: ["some-secret"],

      // all of these are optional
    },
  });

export const getUserToken = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("userId");
};

// Set the user token in the session
export const commitUserToken = async ({
  request,
  userId,
}: {
  request: Request;
  userId: string;
}) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", userId);
  return await commitSession(session);
};

export const logout = async ({ request }: { request: Request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const destroyedSession = await destroySession(session);

  return redirect("/", {
    headers: {
      "Set-Cookie": destroyedSession,
    },
  });
};

// Redirect the user to the home page with the user token
export const authenticatedUser = async ({
  request,
  userId,
}: {
  request: Request;
  userId: string;
}) => {
  const createdSession = await commitUserToken({ request, userId });
  return redirect("/", {
    headers: {
      "Set-Cookie": createdSession,
    },
  });
};

export { getSession, commitSession, destroySession };
