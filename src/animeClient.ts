import axios from "axios";

const ENDPOINT = "https://api.anilibria.tv/v2";
axios.defaults.paramsSerializer = (params) => {
  let result = "";
  Object.keys(params).forEach((key) => {
    result += `${key}=${encodeURIComponent(params[key])}&`;
  });
  return result.substring(0, result.length - 1);
};

export class AnimeClient {
  async findAnime(name: String): Promise<any> {
    try {
      return await axios.get(`${ENDPOINT}/searchTitles`, {
        params: {
          search: name,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async findAnimeByCode(code: String): Promise<any> {
    try {
      return await axios
        .get(`${ENDPOINT}/getTitle`, {
          params: {
            code: code,
          },
        })
        .then((res) => {
          return res.data;
        });
    } catch (error) {
      console.error(error);
    }
  }

  async randomAnime(): Promise<any> {
    try {
      return await axios.get(`${ENDPOINT}/getRandomTitle`).then((res) => {
        return res.data;
      });
    } catch (error) {
      console.error(error);
    }
  }
}
