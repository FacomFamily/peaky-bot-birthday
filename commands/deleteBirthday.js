const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../database/models/User');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Remover aniversário!')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuário que deseja remover a data de aniversário!')),

	async execute(interaction) {
		const usuario = interaction.options.getUser('usuario') == null ? interaction.user : interaction.options.getUser('usuario');
		const guildId = interaction.guildId;

		console.log(usuario, guildId)

		const userSearch = await User.findOne({
			where: {
				user_id: usuario.id,
				channel_id: guildId,
			}
		});

		if (userSearch) {
			await Users.destroy({
				where: {
					user_id: usuario.id,
					channel_id: guildId,
				}
			});
			await interaction.reply(`A data de aniversário do usuário ${usuario.username} foi removido com sucesso!`);
		} else {
			await interaction.reply(`O usuário ${usuario.username} não possui uma data de aniversário!`);
		}
	},
};