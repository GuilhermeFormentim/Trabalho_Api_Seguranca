import jwt from "jsonwebtoken"

import * as dotenv from "dotenv"
dotenv.config()

export function verificaToken(req, res, next) {

  try {
    const token = req.headers.authorization.split(" ")[1]
    const decode = atob(token)
    req.usuario_id = decode.usuario_logado_id
    req.usuario_nome = decode.usuario_logado_nome
    next()
  } catch (error) {
    return res.status(401).json({ erro: "Falha na autenticação" })
  }
}