import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, EmbedBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Responds with a list of commands")
export function execute(interaction: CommandInteraction) {
  const helpEmbed = new EmbedBuilder()
    .setTitle("help menu")
    .setDescription("This is a list of commands")
    .addFields(
      interaction.client.commands.map((command) => {
        return {
          name: `**/${command.data.name}**`,
          value: command.data.description,
        }
      })
    )

  return interaction.reply({ embeds: [helpEmbed], ephemeral: true })
}
