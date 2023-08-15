const { DataTypes } = require('sequelize');

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
 // defino el modelo
 sequelize.define('User', {
id: { 
 type: DataTypes.INTEGER,
 primaryKey: true,
 allowNull: false,
 autoIncrement: true
},
name: {
 type: DataTypes.STRING,
 allowNull: false,
},

email: { 
 type: DataTypes.STRING,
 allowNull: false,
 unique: true,
 validate: {
  isEmail: true,
 }
},
// password lo encriptamos com md5
 password: {
  type: DataTypes.STRING,
  allowNull: false,
 }


 })
}