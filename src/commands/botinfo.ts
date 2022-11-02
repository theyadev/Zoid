import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, EmbedBuilder } from "discord.js"
import { version, repository } from "../../package.json"

export const data = new SlashCommandBuilder()
  .setName("botinfo")
  .setDescription("Responds with infromation about the discord bot")

export function execute(interaction: CommandInteraction) {
  console.log(`User ${interaction.user.username} has used the botinfo command`)
  const botinfo = new EmbedBuilder()
    .setTitle("Bot Info")
    .setDescription("information about the bot")
    .addFields(
      {
        name: "Name",
        value: `${interaction.client.user.username}`,
      },
      {
        name: "version",
        value: `${version}`,
      },
      {
        name: "ping",
        value: `${interaction.client.ws.ping}`,
      },
      {
        name: "github repo",
        value: `${repository.url.replace(".git", "")}`,
      }
    )

  return interaction.reply({ embeds: [botinfo], ephemeral: true })
}
