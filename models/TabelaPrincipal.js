
import { DataTypes } from 'sequelize';
import { sequelize } from '../database/conecta.js';
import Usuario from './Usuario.js';

const Tabela_Principal = sequelize.define('tabela', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null,
  },
});


Tabela_Principal.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  onDelete: 'CASCADE',
});

export default Tabela_Principal;
