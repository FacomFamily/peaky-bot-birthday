const { EmbedBuilder } = require("@discordjs/builders");

const noConfiguretedEmbed = new EmbedBuilder()
	.setColor(0xf23f43)
	.setDescription('É necessário realizar configuração do bot antes de usar, utilize o camando /config para configurar o bot');

module.exports = { noConfiguretedEmbed };