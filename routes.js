import { Router } from "express"
import { usuarioCreate, usuarioIndex, usuarioTrocaSenha } from "./controllers/usuarioController.js"
import { loginUsuario } from "./controllers/loginController.js"
import { verificaToken } from "./middlewares/verificaToken.js"
import { enviaEmail } from "./controllers/emailController.js"
import { softDeleteRecord, incluirRegistro, listarRegistros, alterarRegistro, excluirRegistro, pesquisarRegistro } from "./controllers/tabelaController.js"

const router = Router()

router.get("/usuarios", usuarioIndex)
      .post("/usuarios", usuarioCreate)
      .get("/usuarios/solicitatroca", enviaEmail)
      .patch("/usuarios/trocasenha/:hash", usuarioTrocaSenha)

router.post("/login", loginUsuario)

router.delete("/:id", verificaToken, softDeleteRecord);
router.post('/', incluirRegistro);
router.get('/', listarRegistros);
router.put('/:id', alterarRegistro);
router.delete('/:id', excluirRegistro);
router.get('/search/:keyword', pesquisarRegistro);

export default router