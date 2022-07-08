import { CommandInteraction } from "discord.js";
import { ContextMenu, Discord, Slash } from "discordx";
import { AnimeClient } from "../animeClient.js";
import { find } from "./find.js";

const aniClient = new AnimeClient();

@Discord()
export class Random {
  @Slash("random")
  @ContextMenu("MESSAGE", "Случайное аниме")
  async random(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply();

    const anime: AniModel = (await aniClient.randomAnime()) as AniModel;
    const embed = await find.createAnimeEmbed(anime);

    await interaction.editReply({
      embeds: [embed],
      content: interaction.member?.toString(),
    });

    return;
  }
}
