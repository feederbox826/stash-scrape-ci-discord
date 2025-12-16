import { REST, Routes } from "discord.js";
import { loadEnvFile, env } from "node:process";
import * as commands from "../src/commands.js";
loadEnvFile();

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
const commandsArray = Object.values(commands).map(cmd => {
  delete cmd.execute;
  return cmd;
})

try {
  console.log("Started refreshing slash commands.");
  await rest.put(Routes.applicationCommands(env.DISCORD_APPLICATION_ID), { body: commandsArray });
  console.log("Successfully reloaded slash commands.");
}
catch (error) {
  console.error(error);
}