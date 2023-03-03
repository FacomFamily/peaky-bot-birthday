const cron = require('node-cron');
const { Channel } = require('../database/models/Channel');
const { User } = require('../database/models/User');

const birthdayMessageSchedule = async (client) => {
	await cron.schedule('*/10 * * * * *', async () => {
		console.log('Start search of birthdays of users')
		const now = new Date();
		const day = `${now.getDate()}`.padStart(2, '0');
		const month = `${now.getMonth() + 1}`.padStart(2, '0');

		const channels = await Channel.findAll({
			include: [{
				model: User,
				where: {
					day,
					month,
				}
			}]
		});

		if (channels.length == 0) {
			console.log('No birthdays found');
			return;
		}

		for (const channel of channels) {
			const channelsToSendMessage = channel.get({ plain: true });
			const users = channelsToSendMessage.users;
			for (const user of users) {
				console.log('channel ', channelsToSendMessage.channel_id)
				client.channels.cache.get(channelsToSendMessage.channel_id).send(`Happy birthday <@${user.user_id}>!`);
			}
		}
		console.log('End search of birthdays of users')
	});
};

module.exports = { birthdayMessageSchedule };