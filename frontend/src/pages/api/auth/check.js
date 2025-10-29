import { api } from "@/app/lib/axios";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
  try {
    const session = await getSession(req, res);

    if (!session) {
      console.log("No hay sesión");
      return res.status(401).json({ status: "no_session" });
    }

    const accessToken = session.user?.accessToken;

    if (!accessToken) {
      console.log("Sesión encontrada, pero sin accessToken");
      return res.status(401).json({ status: "no_token" });
    }

    console.log("Token leído desde sesión:", accessToken);

    const response = await api.post("/auth/login/", { auth0_token: accessToken });

    const rawSetCookie = response.headers.get("set-cookie");
    const data = response.data
    if (rawSetCookie) {
      res.setHeader("set-cookie", rawSetCookie);
    }

   res.status(200).json(data);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ status: "server_error" });
  }
}
