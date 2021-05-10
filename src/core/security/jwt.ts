import * as jwt from "jsonwebtoken";

interface SignData {
  name: string;
  email: string;
  rememberMe?: boolean;
}

function sign(data: SignData): string {
  const expiresIn = data.rememberMe ? "7d" : +process.env.TOKEN_TIMEOUT!;

  const token = jwt.sign({ data }, process.env.TOKEN_SECRET!, { expiresIn });

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
