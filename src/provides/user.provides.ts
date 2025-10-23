import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

interface UserPayload {
  id: number | string;
  role: string;
  email: string;
}

class AuthProvider {
  async encodeToken(user: UserPayload): Promise<string> {
    const secret = process.env.JWT_SECRET as Secret;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const expiresIn = process.env
      .JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"];

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      secret,
      {
        expiresIn,
        algorithm: "HS256",
      }
    );

    return token;
  }

  async decodeToken(token: string): Promise<JwtPayload | string> {
    const secret = process.env.JWT_SECRET as Secret;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.verify(token, secret);
  }
}

export default new AuthProvider();
