import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { Intents } from "discord.js";
import { Client } from "discordx";
import dotenv from "dotenv";

export const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],

  silent: false,
  botGuilds: ["216168957390880768"],
});

bot.once("ready", async () => {
  await bot.guilds.fetch();

  await bot.initApplicationCommands();
  await bot.initApplicationPermissions();

  console.log(">> Bot started");
});

bot.on("interactionCreate", async (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  dotenv.config();

  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await bot.login(process.env.BOT_TOKEN);
}

run();
