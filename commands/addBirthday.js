const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../database/models/User');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addBirthday')
		.setDescription('Adiciona a data de aniversário!')
		.addStringOption(option =>
			option.setName('data')
				.setDescription('Data de aniversário! (DD/MM)').setRequired(true))
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('Usuário que deseja adicionar a data de aniversário!'))
		.addStringOption(option =>
			option.setName('time_zone')
				.setDescription('Fuso horário! (Ex: America/Sao_Paulo)'))
		.addStringOption(option =>
			option.setName('mensagem_especial')
				.setDescription('Mensagem especial! (Ex: Parabéns, feliz aniversário!)')),

	async execute(interaction) {
		const data = interaction.options.getString('data');
		const usuario = interaction.options.getUser('usuario') ?? null;
		const mensagemEspecial = interaction.options.getString('mensagem_especial') ?? null;
		const guildId = interaction.guildId;

		console.log('servidor id:', guildId)

		if (usuario) {
			try {
				const user = await User.create({
					user_id: usuario.id,
					day: data.split('/')[0],
					month: data.split('/')[1],
					special_message: mensagemEspecial,
					channel_id: guildId,
				});
				console.log(user.toJSON());
				await interaction.reply(`Adicionando a data de aniversário ${data} para o usuário ${usuario.username}!`);
			} catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					await interaction.reply('Esse usuário já possui uma data de aniversário!');
					return;
				}
				console.error(e);
				await interaction.reply('Erro ao adicionar a data de aniversário!');
				return;
			}
		} else {
			try {
				const user = await User.create({
					user_id: interaction.user.id,
					day: data.split('/')[0],
					month: data.split('/')[1],
					guild_id: interaction.guild.id,
					special_message: mensagemEspecial,
					channel_id: guildId,
				});
				console.log(user.toJSON());
				await interaction.reply(`Adicionando a data de aniversário ${data} para você!`);
			} catch (e) {
				if (e.name === 'SequelizeUniqueConstraintError') {
					await interaction.reply('Você já possui uma data de aniversário!');
					return;
				}
				console.error(e);
				await interaction.reply('Erro ao adicionar a data de aniversário!');
				return;
			}
		}
	},
};