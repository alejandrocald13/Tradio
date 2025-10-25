import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";

export default async function AuthCallback(){
    const {
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        logout,
        getIdTokenClaims
    } = useAuth0();



    useEffect(() => {
        const sendTokenToBackend = async () => {
        try {
            const claims = await getIdTokenClaims();
            const token = claims.__raw;

            const response = await api.post("/auth/login/", { auth0_token: token });

            if (response.status === 200) {
            setMessage("Inicio de sesión exitoso.");
            console.log("Cookie JWT configurada en el backend");
            }

        } catch (err) {
            if (err.response) {
            const { status, data } = err.response;

            if (status === 403) {
                setMessage(data.message || "Acceso restringido.");
            } else if (status === 400) {
                setMessage("Token inválido o sesión expirada.");
            } else {
                setMessage("Error inesperado al autenticar.");
            }

            logout({ logoutParams: { returnTo: window.location.origin } });
            } else {
            console.error("Error al enviar token al backend:", err);
            setMessage("Error de conexión con el servidor.");
            }
        }};

        if (!isLoading && isAuthenticated) {
            sendTokenToBackend();}
    }, [isAuthenticated, isLoading]);

}