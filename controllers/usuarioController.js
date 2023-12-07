import { Troca } from "../models/Troca.js"
import { Usuario } from "../models/Usuario.js"

export async function usuarioIndex(req, res) {
  try {
    const usuarios = await Usuario.findAll()
    res.status(200).json(usuarios)
  } catch (error) {
    res.status(400).send(error)
  }
}

function validaSenha(senha) {

  const mensagem = []

  if (senha.length < 8) {
    mensagem.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
  }

  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  for (const letra of senha) {

    if ((/[a-z]/).test(letra)) {
      pequenas++
    }
    else if ((/[A-Z]/).test(letra)) {
      grandes++
    }
    else if ((/[0-9]/).test(letra)) {
      numeros++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
    mensagem.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
  }

  return mensagem
}

export async function usuarioCreate(req, res) {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    res.status(400).json("Erro... Informe nome, email e senha")
    return
  }

  const mensagem = validaSenha(senha)
  if (mensagem.length > 0) {
    res.status(400).json({ erro: mensagem.join(", ") })
    return
  }

  try {
    const usuario = await Usuario.create({
      nome, email, senha
    })
    res.status(201).json(usuario)
  } catch (error) {
    res.status(400).send(error)
  }
}

export async function usuarioTrocaSenha(req, res) {
  const { hash } = req.params
  const { email, novasenha } = req.body

  if (!email || !novasenha) {
    res.status(400).json("Erro... Informe email e novasenha")
    return
  }

  const mensagem = validaSenha(novasenha)
  if (mensagem.length > 0) {
    res.status(400).json({ erro: mensagem.join(", ") })
    return
  }

  try {

    const solicitacao = await Troca.findOne({ where: { hash, email } })

    if (solicitacao == null) {
      res.status(400).json({ erro: "Não foi possível trocar a senha..." })
      return
    }

    await Usuario.update({
      senha: novasenha
    }, {
      where: { email },
      individualHooks: true
    })
    res.status(200).json({ msg: "Ok! Troca de senha realizada com sucesso" })
  } catch (error) {
    res.status(400).send(error)
  }
}

