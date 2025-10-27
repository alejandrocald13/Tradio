export const runtime = "nodejs";

import { api } from "@/app/lib/axios";
import { handleAuth, handleLogin, handleCallback } from "@auth0/nextjs-auth0/edge";
import { getSession } from "@auth0/nextjs-auth0/edge";


export const GET = handleAuth({
  signup: handleLogin({
    authorizationParams: { screen_hint: "signup" },
  }),

  callback: handleCallback(async (req, res) => {
    const session = await getSession(req, res);

    const idToken = session.idToken;
    const response = await api.post("/auth/login/", { auth0_token: idToken });

    const data = await response.json();

    let redirectUrl = "/landing";
    switch (data.status) {
      case 1:
        redirectUrl = "/register";
        break;
      case 2:
        redirectUrl = data.user.is_superuser ? "/adminHome" : "/authHome";
        break;
    }

    return Response.redirect(new URL(redirectUrl, req.url));
  }),
});

export const POST = GET;
