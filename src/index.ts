import connect from "./db/connect"
import dotenv from "dotenv"
import getJsFiles from "./utils/getJsFiles"

import { Client, GatewayIntentBits, Collection } from "discord.js"
import { resolve, join } from "path"

dotenv.config()

if (!process.env.MONGO_URI)
  throw new Error("MONGO_URI is not defined in the .env file")
if (!process.env.BOT_TOKEN)
  throw new Error("BOT_TOKEN is not defined in the .env file")

const TOKEN = process.env.BOT_TOKEN
const MONGO_URI = process.env.MONGO_URI

// throw an error if the token  or URI is not defined
if (!TOKEN) throw new Error("TOKEN is not defined")
if (!MONGO_URI) throw new Error("MONGO_URI is not defined")

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

declare module "discord.js" {
  interface Client {
    commands: Collection<unknown, any>
  }
}

// Create a new collection for the future commands
client.commands = new Collection()

// Initialize database
connect(MONGO_URI)

// #region Folders & Files declaration
const commandDir = resolve(__dirname, "commands")
const eventDir = resolve(__dirname, "events")

const commandFiles = getJsFiles(commandDir)
const eventFiles = getJsFiles(eventDir)
// #endregion

// #region Handle commands
for (const file of commandFiles) {
  const command = require(join(commandDir, file))
  client.commands.set(command.data.name, command)
}
// #endregion

// #region Handle events
for (const file of eventFiles) {
  const event = require(join(eventDir, file))

  // set the handler to the "once" function if the event is a once event
  const handler = event.once ? "once" : "on"

  client[handler](event.name, (...args) => event.execute(...args))
}
// #endregion

client.login(TOKEN)
