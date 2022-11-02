import { Client, GatewayIntentBits, Collection } from "discord.js"
import { readdirSync } from "fs"
import { resolve } from "path"
import { Bot, DB } from "./config.json"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const TOKEN = process.env.TOKEN
const MONGO_URI = process.env.MONGO_URI

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

declare module "discord.js" {
  interface Client {
    commands: Collection<unknown, any>
  }
}

// Initialize database
mongoose
  .connect(MONGO_URI!)
  .then(() => {
    console.log("Database initialized.")
  })
  .catch((error) => {
    console.log(error)
  })

//#region get all command files
client.commands = new Collection()

const commandFiles = readdirSync(resolve(__dirname, "commands")).filter(
  (file) => file.endsWith(".js")
)
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}
// #endregion

//#region event handler
const eventFiles = readdirSync(resolve(__dirname, "events")).filter((file) =>
  file.endsWith(".js")
)
for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}
// #endregion

client.login(TOKEN)
