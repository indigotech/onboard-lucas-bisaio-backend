import * as jwt from "jsonwebtoken";
import { AuthError, ErrorMessage } from "../error";

interface SignData {
  id: number;
  rememberMe?: boolean;
}

interface DecodedData {
  data: number;
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
  try {
    jwt.verify(jwtoken, process.env.TOKEN_SECRET!) as DecodedData;
  } catch ({ message }) {
    throw new AuthError(ErrorMessage.token.expired, message);
  }

  return true;
}

function decode(token: string): DecodedData {
  token = token.replace("Bearer ", "");
  return jwt.decode(token) as DecodedData;
}

export const JWTService = {
  sign,
  verify,
  decode,
};
