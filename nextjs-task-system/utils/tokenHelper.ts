export const isTokenExpired = (token: string): boolean => {
  try {
   
    const payloadBase64 = token.split(".")[1];

    if (!payloadBase64) {
      throw new Error("Invalid token format.");
    }

   
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) {
      throw new Error("Token does not have an 'exp' field.");
    }

   
    const now = Math.floor(Date.now() / 1000);

   
    return payload.exp < now;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; 
  }
};

  