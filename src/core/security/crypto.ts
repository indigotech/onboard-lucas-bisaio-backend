import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

export class CryptoService {
  static encode(value: string): string {
    return crypto.createHash("sha256").update(value).digest("base64");
  }
}

export class JWTService {
  public readonly timeout: number = +process.env.TOKEN_TIMEOUT!;
  public readonly secret: string = process.env.TOKEN_SECRET!;

  sign(data: any): string {
    return jwt.sign({ data }, this.secret, { expiresIn: this.timeout });
  }
  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}
