import bcrypt from "bcrypt";

class HashProvides {
  async generateHash(
    plainText: string
  ): Promise<{ hashString: string; salt: string }> {
    const salt = await bcrypt.genSalt(8);
    const hashString = await bcrypt.hash(plainText, salt);
    return { hashString, salt };
  }

  async compareHash(plainText: string, hashString: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hashString);
    return isMatch;
  }
}

export default new HashProvides();
