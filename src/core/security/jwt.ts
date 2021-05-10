import * as jwt from "jsonwebtoken";

interface SignData {
  id: number;
  rememberMe?: boolean;
}

function sign(value: SignData): string {
  const { rememberMe, id } = value;
  const expiresIn = rememberMe ? "7d" : +process.env.TOKEN_TIMEOUT!;

  const token = jwt.sign({ data: id }, process.env.TOKEN_SECRET!, { expiresIn });

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
