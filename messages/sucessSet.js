const { EmbedBuilder } = require("@discordjs/builders");

const sucessSet = new EmbedBuilder()
	.setColor(0x50fa7b)
	.setDescription('Canal definido com sucesso!');

const sucessUpdated = new EmbedBuilder()
	.setColor(0x50fa7b)
	.setDescription('Canal atualizado com sucesso!');

module.exports = { sucessSet, sucessUpdated };