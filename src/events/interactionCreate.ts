import { Interaction } from "discord.js"
module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction: Interaction) {
    // figure out what interaction type it is
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName)
      if (!command) return
      try {
        await command.execute(interaction)
      } catch (error) {
        console.error(error)
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        })
      }
    } else {
      return
    }
  },
}
