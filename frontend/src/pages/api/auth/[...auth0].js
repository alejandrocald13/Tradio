import { handleAuth, handleLogin, handleCallback } from "@auth0/nextjs-auth0";

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        afterCallback: async (_req, _res, session) => {
          session.user.accessToken = session.accessToken;
          session.user.idToken = session.idToken;
          return session;
        },
      });
    } catch (error) {
      console.error("Error en callback Auth0:", error);
      res.status(error.status || 500).end(error.message);
    }
  },

  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: "openid profile email",
    },
  }),

  signup: handleLogin({
    authorizationParams: {
      screen_hint: "signup",
      audience: process.env.AUTH0_AUDIENCE,
      scope: "openid profile email",
    },
  }),
});
