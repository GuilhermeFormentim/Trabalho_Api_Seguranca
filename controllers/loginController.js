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
      complemento: `E-mail: ${email}`
    })

    if (usuario == null) {
      res.status(400).json({ erro: mensagemErroPadrao })
      return
    }
    if (bcrypt.compareSync(senha, usuario.senha)) {

      const token = jwt.sign({
        usuario_logado_id: usuario.id,
        usuario_logado_nome: usuario.nome
      },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      )

      res.status(200).json({ msg: "Ok. Logado", token })
    }
    else {
      res.status(400).json({ erro: mensagemErroPadrao })
      return
    }
  } catch (error) {
    res.status(400).json(error)
  }
}