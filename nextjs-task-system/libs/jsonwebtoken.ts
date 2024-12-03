import  jwt, { TokenExpiredError } from "jsonwebtoken";

/** Class represents a Json web token instance.
 */
export default class JWToken {
  /**
   * Check the validity of a token.
   * @method
   * @param {string} token - Token to validate.
   * @returns {object} -> Operation result.
   */
  verifyJwt = (token: object) => {
    return jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
      if (err) {
        if (err instanceof TokenExpiredError) {
          return { error: "Sesion expired" };
        } else {
          return { error: "Invalid token" };
        }
      } else {
        return decoded;
      }
    });
  };

  /**
   * Check the validity of a token.
   * @method
   * @param {object} payload - Payload to set in the jwt.
   * @param {number|string} expiresInMinute - Minutes to expire the jwt.
   * @returns {string} -> Json web token.
   */
  parseJwt = (payload: object) => {
    return jwt.sign(payload, process.env.SECRET_JWT, {
        expiresIn: 60 * parseInt(process.env.SESION_TIME), 
    });
  };
}