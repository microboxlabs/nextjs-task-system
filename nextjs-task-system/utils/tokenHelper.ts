export const isTokenExpired = (token: string): boolean => {
  try {
    // Dividir el token en sus partes (header, payload, signature)
    const payloadBase64 = token.split(".")[1];

    if (!payloadBase64) {
      throw new Error("Invalid token format.");
    }

    // Decodificar el payload del JWT (parte intermedia del token)
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) {
      throw new Error("Token does not have an 'exp' field.");
    }

    // Obtener la fecha y hora actual en segundos
    const now = Math.floor(Date.now() / 1000);

    // Comparar el campo 'exp' del token con el tiempo actual
    return payload.exp < now;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Asumir expiración en caso de error
  }
};

  