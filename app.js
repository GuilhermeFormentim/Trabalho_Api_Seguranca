import express from 'express'
import { sequelize } from './database/conecta.js'
import { Usuario } from './models/Usuario.js'
import routes from './routes.js'
import { Troca } from './models/Troca.js'
import { Log } from './models/Log.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(routes)

app.get('/', (req, res) => {
  res.send('Sistema de TRABALHO API')
})

async function conecta_db() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com Banco de Dados realizada com Sucesso');

    await Usuario.sync()
    console.log("Tabela de Usuários: Ok")

    await Log.sync()
    console.log("Tabela de Logs: Ok")

    await Troca.sync()
    console.log("Tabela de Solicitações de Troca de Senhas: Ok")

  } catch (error) {
    console.error('Erro ao conectar o banco de dados:', error);
  }
}
conecta_db()

app.listen(port, () => {
  console.log(`API de Cadastro Rodando na Porta: ${port}`)
})