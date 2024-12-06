import jwt, { TokenExpiredError, JwtPayload, JsonWebTokenError } from 'jsonwebtoken';

/** La clase representa una instancia de Json Web Token. */
export default class JWToken {
  /**
   * Verifica la validez de un token.
   * @method
   * @param {string} token - Token a validar.
   * @returns {JwtPayload | { error: string }} -> Resultado de la operación o carga decodificada si es válida.
   */
  verifyJwt = (token: string): JwtPayload | { error: string } => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_JWT as string);
      return decoded as JwtPayload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return { error: "Sesión expirada" };
      } if (err instanceof JsonWebTokenError) {
        return { error: "Token con firma no válida" };
      }else {
        return { error: "Token inválido" };
      }
    }
  };

  /**
   * Genera un nuevo JWT con una carga útil dada.
   * @method
   * @param {object} payload - Carga útil para establecer en el JWT.
   * @returns {string} -> El JWT generado.
   */
  parseJwt = (payload: object): string => {
    const expireTime = 60 * parseInt(process.env.TIEMPO_SESION ?? '999999');
    return jwt.sign(payload, process.env.SECRET_JWT as string, {
      expiresIn: expireTime,
    });
  };
}
