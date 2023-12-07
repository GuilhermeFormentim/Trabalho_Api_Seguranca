import bcrypt from 'bcrypt'

import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conecta.js';
import { Log } from './Log.js';

export const Usuario = sequelize.define('usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  senha: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  token_recuperacao_senha: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
  },
}, {
  timestamps: false
});

Usuario.beforeCreate(usuario => {
  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(usuario.senha, salt)
  usuario.senha = hash
})

Usuario.beforeUpdate(usuario => {
  const salt = bcrypt.genSaltSync(12)
  const hash = bcrypt.hashSync(usuario.senha, salt)
  usuario.senha = hash
})

Usuario.hasMany(Log, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Log.belongsTo(Usuario, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });

export default Usuario;