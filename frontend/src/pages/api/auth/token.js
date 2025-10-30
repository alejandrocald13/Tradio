// pages/api/auth/token.js
import { getAccessToken } from "@auth0/nextjs-auth0";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { accessToken } = await getAccessToken(req, res);

    if (!accessToken) {
      return res.status(401).json({ error: "No access token available" });
    }

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error getting Auth0 token:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve access token", details: error.message });
  }
}
