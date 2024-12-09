import jwt from "jsonwebtoken";

export function validateToken(req) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        return { valid: false, message: "Authorization header missing" };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return { valid: false, message: "Token missing" };
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, payload: decoded };
    } catch (error) {
        return { valid: false, message: "Invalid token" };
    }
}
