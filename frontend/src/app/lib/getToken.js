export default async function getToken(){
    try {
    const res = await fetch("/api/auth/token");
    if (!res.ok) throw new Error("Token request failed");
    const data = await res.json();
    return data.accessToken;
} catch (err) {
    console.error("Error obtaining token:", err);
    return null;
}}