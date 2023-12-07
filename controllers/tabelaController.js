import { Op } from 'sequelize';
import TabelaPrincipal from '../models/TabelaPrincipal.js';
import { Log } from '../models/Log.js';


export async function softDeleteRecord(req, res) {
  try {

    const { id } = req.params;
    const registro = await findByPk(id);

    if (!registro) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    await registro.update({ deletedAt: new Date() });
    res.status(200).json({ message: 'Registro excluído logicamente' });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir registro' });

  }
}

export async function incluirRegistro(req, res) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Informe nome, email e senha' });
    }
    const registro = await TabelaPrincipal.create({ nome, email, senha });
    res.status(201).json(registro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao incluir registro' });
  }
}

export async function listarRegistros(req, res) {
  try {
    const registros = await TabelaPrincipal.findAll();
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar registros' });
  }
}

export async function alterarRegistro(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const registro = await TabelaPrincipal.findByPk(id);
    if (!registro) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    await registro.update({ nome, email, senha });

    await Log.create({
      descricao: `Alteração do Registro: ${id}`,
      complemento: `Usuário: ${req.usuario_logado_id} - ${req.usuario_logado_nome}`
    })

    res.status(200).json({ message: 'Registro alterado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alterar registro' });
  }
}

export async function excluirRegistro(req, res) {
  try {
    const { id } = req.params;
    const registro = await TabelaPrincipal.findByPk(id);
    if (!registro) {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
    await registro.destroy({
      where: { id },
    });

    await Log.create({
      descricao: `Exclusão do Veículo Id: ${id}`,
      complemento: `Usuário: ${req.usuario_logado_id} - ${req.usuario_logado_nome}`
    })

    res.status(200).json({ message: 'Registro excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir registro' });
  }
}

export async function pesquisarRegistro(req, res) {
  try {
    const { nome } = req.body;
    const registros = await TabelaPrincipal.findAll({
      where: { nome: { [Op.like]: `%${nome}%` } },
    });
    res.status(200).json(registros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao pesquisar registros' });
  }
}

export default {
  softDeleteRecord,
};
