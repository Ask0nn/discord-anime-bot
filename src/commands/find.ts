import {
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  Modal,
  TextInputComponent,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import {
  ContextMenu,
  Discord,
  ModalComponent,
  SelectMenuComponent,
  Slash,
} from "discordx";
import { AnimeClient } from "../animeClient.js";

export const aniClient = new AnimeClient();

@Discord()
export class find {
  @ContextMenu("MESSAGE", "Найти аниме по названию")
  @Slash("find")
  findForm(interaction: CommandInteraction): void {
    const row = new MessageActionRow<ModalActionRowComponent>().addComponents(
      new TextInputComponent()
        .setCustomId("find-txt")
        .setLabel("Название аниме")
        .setStyle("SHORT")
    );

    const form = new Modal()
      .setTitle("Форма для поиска аниме по названию")
      .setCustomId("find-form")
      .setComponents(row);

    interaction.showModal(form);
  }

  @ModalComponent("find-form")
  async handleFind(interaction: ModalSubmitInteraction): Promise<void> {
    const anime = interaction.fields.getTextInputValue("find-txt");
    const list: AniListModel = await aniClient.findAnime(
      anime
    ) as AniListModel;
    let embed;

    if (list.data && list.data.length <= 0)
      embed = await find.createNotFoundEmbed(anime);
    else if (list.data.length === 1)
      embed = await find.createAnimeEmbed(list.data?.at(0) as AniModel);
    else {
      const menu = new MessageSelectMenu()
        .addOptions(
          list.data.map((a) => ({ label: a.names.ru, value: a.code }))
        )
        .setCustomId("anime-menu");

      const buttonRow = new MessageActionRow().addComponents(menu);

      await interaction.reply({
        components: [buttonRow],
        content: interaction.member?.toString(),
      });
      setTimeout(() => interaction.deleteReply(), 15000);

      return;
    }

    await interaction.reply({
      embeds: [embed],
      content: interaction.member?.toString(),
    });

    return;
  }

  @SelectMenuComponent("anime-menu")
  async handleMenu(interaction: SelectMenuInteraction): Promise<void> {
    await interaction.deferReply();
    const code = interaction.values?.[0];
    const anime: AniModel = (await aniClient.findAnimeByCode(code)) as AniModel;
    const embed = await find.createAnimeEmbed(anime);
    await interaction.editReply({
      embeds: [embed],
      content: interaction.member?.toString(),
    });

    return;
  }

  public static async createAnimeEmbed(anime: AniModel): Promise<MessageEmbed> {
    const embed = new MessageEmbed()
      .setColor("#29af76")
      .setTitle(anime.names.ru)
      .setURL(`https://anilibria.tv/release/${anime.code}.html`)
      .setAuthor({
        name: "Anilibria.tv",
        iconURL: "https://anilibria.tv/img/logo_new1.png",
        url: "https://anilibria.tv/",
      })
      .setDescription(anime.description)
      .addFields(
        anime.type.string
          ? { name: "Тип", value: anime.type.string, inline: true }
          : { name: "\u200B", value: "\u200B" },
        anime.type.length
          ? {
              name: "Длительность",
              value: anime.type.length.toString(),
              inline: true,
            }
          : { name: "\u200B", value: "\u200B" },
        anime.season.year
          ? { name: "Год", value: anime.season.year.toString(), inline: true }
          : { name: "\u200B", value: "\u200B" }
      )
      .setTimestamp();

    if (anime.posters.large)
      embed.setImage(`https://anilibria.tv${anime.posters.large.url}`);
    else if (anime.posters.medium)
      embed.setImage(`https://anilibria.tv${anime.posters.medium.url}`);
    else embed.setImage(`https://anilibria.tv${anime.posters.small.url}`);
    if (anime.announce) embed.setFooter({ text: anime.announce });

    return embed;
  }

  public static async createNotFoundEmbed(name: string): Promise<MessageEmbed> {
    const embed = new MessageEmbed()
      .setColor("#d83c3c")
      .setTitle(`Аниме не найдено (${name})`)
      .setAuthor({
        name: "Anilibria.tv",
        iconURL: "https://anilibria.tv/img/logo_new1.png",
        url: "https://anilibria.tv/",
      })
      .setDescription(
        "Попробуйте указать альтернативное название или более точно напишите название."
      )
      .setImage(
        "https://static.wikia.nocookie.net/v__/images/5/5f/404_not_found.png/revision/latest?cb=20171104190424&path-prefix=vocaloidlyrics"
      )
      .setTimestamp();

    return embed;
  }
}
