import { SlashCommandBuilder } from "@discordjs/builders"
import { CommandInteraction, EmbedBuilder, GuildMember } from "discord.js"
import { userModel } from "../models/user"
import { verifiedRole } from "../config.json"

export const data = new SlashCommandBuilder()
  .setName("verify")
  .setDescription("verify yourself")
export function execute(interaction: CommandInteraction) {
  console.log(
    `User ${interaction.user.username} has started the verification process`
  )
  // get the users guild member
  const member = interaction.member as GuildMember

  //check if the user has the role
  if (member.roles.cache.has(verifiedRole)) {
    return interaction.reply({
      content: "You are already verified",
      ephemeral: true,
    })

    // if they don't, add the role and send a message saying they are verified
  } else {
    member.roles.add(verifiedRole)
    // check if the user is in the database
    userModel.findOne({ id: member.id }, async (err: any, data: any) => {
      if (err) throw err
      if (data) {
        data.verified = true
      } else {
        data = new userModel({
          id: member.id,
          username: member.user.username,
          discriminator: member.user.discriminator,
          level: 0,
          verified: true,
          warnings: [],
        })
      }
      data.save()
    })

    return interaction.reply({
      content: "You are now verified",
      ephemeral: true,
    })
  }
}
