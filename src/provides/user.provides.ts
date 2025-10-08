import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();
import "dotenv/config";

class AuthProvider {
  async encodeToken(user) {
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
        algorithm: "HS256",
      }
    );
    return token;
  }
  async decodeToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default new AuthProvider();
