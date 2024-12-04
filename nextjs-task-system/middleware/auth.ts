import JWToken from "@/libs/jsonwebtoken";

export const validateToken = (handler) => {
  return async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado o inválido" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = new JWToken().verifyJwt(token);
      req.user = decoded;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
};