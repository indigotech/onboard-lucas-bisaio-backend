import * as jwt from "jsonwebtoken";
import { UserType } from "schema";

function sign(data: UserType): string {
  const tokenData = {
    name: data.name,
    email: data.email,
  };
  const token = jwt.sign({ data: tokenData }, process.env.TOKEN_SECRET!, { expiresIn: +process.env.TOKEN_TIMEOUT! });

  return `Bearer ${token}`;
}

// TODO: verify token - Future Feature
function verify(token: string) {
  return jwt.verify(token, process.env.TOKEN_SECRET!);
}

export const JWTService = {
  sign,
  verify,
};
