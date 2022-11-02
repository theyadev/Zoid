import { REST, Routes } from "discord.js"
import fs from "fs"
import { resolve } from "path"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.BOT_TOKEN)
  throw new Error("BOT_TOKEN is not defined in the .env file")
if (!process.env.CLIENT_ID)
  throw new Error("CLIENT_ID is not defined in the .env file")
if (!process.env.GUILD_ID)
  throw new Error("GUILD_ID is not defined in the .env file")

const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN)

const commands: string[] = []

// Place your client and guild ids here
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID

const commandFiles = fs
  .readdirSync(resolve(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

// update the refesh and deploy commands
;(async () => {
  try {
    console.log("Started refreshing application (/) commands.")

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    })

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
})()
