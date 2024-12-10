import bcrypt from 'bcryptjs';
const saltRounds = 10;

/** Encripta y valida cadenas de texto. */
export default class Encrypt {
  private str: string;

  /**
   * @constructor
   * @param {string} str - Cadena a encriptar o comparar.
   */
  constructor(str: string) {
    this.str = str;
  }

  /**
   * Encripta una cadena de texto.
   * @method
   * @returns {Promise<string>} -> Resultado de la operación.
   */
  encrypt_str = async (): Promise<string> => {
    return await bcrypt.hash(this.str, saltRounds);
  }

  /**
   * Compara un hash con una cadena de texto.
   * @method
   * @param {string} currentHash - Hash a comparar.
   * @returns {Promise<boolean>} -> Resultado de la operación.
   */
  compare_str = async (currentHash: string): Promise<boolean> => {
    return await bcrypt.compare(currentHash, this.str);
  }
}

