const { DataTypes } = require("sequelize");
const { sequelize } = require("../connection");
const { User } = require("./User");

const Channel = sequelize.define('channels', {
	channel_id: {
		type: DataTypes.STRING,
		allowNull: false
	},
	guild_id: {
		type: DataTypes.STRING,
		primaryKey: true,
		allowNull: false
	},
	messages: {
		type: DataTypes.STRING,
	}
});

User.belongsTo(Channel, { foreignKey: 'channel_id' });
Channel.hasMany(User, { foreignKey: 'channel_id', onDelete: 'CASCADE' });

module.exports = { Channel };