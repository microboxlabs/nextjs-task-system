import bcrypt from 'bcryptjs';
const saltRounds = 10;

/** Encrypt & validate strings. 
*/
export default class Encrypt {

  /**
   * @constructor
   * @param {string} str - String to encrypt / compare.
  */
  constructor(str:string) {
    this.str = str;
  }
  
  /**
     * Encrypt a string.
     * @method
     * @returns {string} -> Operation result.
  */
  encrypt_str = async()=> {
    return await bcrypt.hash(this.str, saltRounds);
  }

  /**
     * Compare a hash with a string.
     * @method
     * @param {string} currentHash - Hash to compare.
     * @returns {boolean} -> Operation result.
  */
  compare_str = async(currentHash:string)=> {
    return await bcrypt.compare(currentHash, this.str,);
  }
};

