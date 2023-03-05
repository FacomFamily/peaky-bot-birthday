const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");

const User = sequelize.define('users', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	user_id: {
		type: DataTypes.STRING,
		unique: true,
		allowNull: false
	},
	day: {
		type: DataTypes.STRING,
		allowNull: false
	},
	month: {
		type: DataTypes.STRING,
		allowNull: false
	},
	special_message: {
		type: DataTypes.STRING,
	}
});

module.exports = { User };