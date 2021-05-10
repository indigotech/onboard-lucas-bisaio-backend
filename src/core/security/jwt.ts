import * as jwt from "jsonwebtoken";
import { AuthError, ErrorMessage } from "../error";

interface SignData {
  id: number;
  rememberMe?: boolean;
}

interface DecodedData {
  data: SignData;
  iat: Date;
  exp: Date;
}

function sign(value: SignData): string {
  const { rememberMe, id } = value;
  const expiresIn = rememberMe ? "7d" : +process.env.TOKEN_TIMEOUT!;

  const token = jwt.sign({ data: id }, process.env.TOKEN_SECRET!, { expiresIn });

  return `Bearer ${token}`;
}

function verify(token: string): boolean {
  const Bearer = "Bearer ";
  if (token.indexOf(Bearer) === -1) {
    throw new AuthError(ErrorMessage.token.invalid);
  }

  const jwtoken = token.replace(Bearer, "");
  const decoded = jwt.verify(jwtoken, process.env.TOKEN_SECRET!) as DecodedData;

  const isValid = new Date(+decoded.exp * 1000) > new Date();

  if (!isValid) {
    throw new AuthError(ErrorMessage.token.expired);
  }

  return true;
}

export const JWTService = {
  sign,
  verify,
};
