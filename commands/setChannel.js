const { SlashCommandBuilder } = require('discord.js');
const { Channel } = require('../database/models/Channel');
const { sucessSet, sucessUpdated } = require('../messages/sucessSet');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_channel')
		.setDescription('Seta o canal ao qual o bot irá funcionar!')
		.addChannelOption(option =>
			option.setName('canal')
				.setDescription('Canal que deseja setar!').setRequired(true)),

	async execute(interaction) {
		const channel = interaction.options.getChannel('canal');
		const guild = interaction.guild;

		Channel.findOne({ where: { guild_id: guild.id } })
			.then(async (obj) => {
				if (obj) {
					obj.update({ channel_id: channel.id });
					await interaction.reply({ embeds: [sucessUpdated] });
				} else {
					Channel.create({
						guild_id: guild.id,
						channel_id: channel.id
					});
					await interaction.reply({ embeds: [sucessSet] });
				}
			})

	},
};