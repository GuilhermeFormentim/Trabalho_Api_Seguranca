import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import * as dotenv from "dotenv"
dotenv.config()

import { Usuario } from "../models/Usuario.js"
import { Log } from "../models/Log.js"

export async function loginUsuario(req, res) {
  const { email, senha } = req.body

  const mensagemErroPadrao = "Erro... Login ou senha incorreto"

  if (!email || !senha) {
    res.status(400).json({ erro: mensagemErroPadrao })
    return
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } })

    await Log.create({
      descricao: `Tentativa de Login Inválida`,
      complemento: `E-mail: ${email}`,
    })

    if (usuario == null) {
      res.status(400).json({ erro: mensagemErroPadrao })
      return
    }

    if (await bcrypt.compare(senha, usuario.senha)) {

      //A principio o erro fica nessa parte do codigo, pq fica retornando 400, e de vez em quando
      //No insomnia mostrava um bagulho gigante (criei um outro arquivo pra te mostrar o erro que aparecia)
      const token = jwt.sign(
        {
          usuario_id: usuario.id,
          usuario_nome: usuario.nome,
        },
        process.env.SECRET,
        {
          expiresIn: 300,
        }
      )

      res.status(200).json({ token })
      return
    }

  } catch (error) {
    res.status(400).json(error)
  }
}