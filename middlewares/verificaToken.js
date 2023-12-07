import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export function verificaToken(req, res, next) {
  try {
    const decodedSecretToken = jwt.decode(req.headers.authorization);

    if (process.env.id == decodedSecretToken.usuario_id &&
      process.env.usuario == decodedSecretToken.usuario_nome) {
      return next();
    }
    throw error();

  } catch (error) {
    return res.status(401).json({ erro: "Falha na autenticação" });
  }
}