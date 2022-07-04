import axios from "axios";

export type LiquipediaPageResponse = {
  parse: {
    text: {
      "*": string;
    };
    displaytitle: string;
  };
};

export const liquipediaClient = axios.create({
  baseURL: "https://liquipedia.net/rocketleague/",
  headers: {
    "User-Agent": `rlcs.date/1.0 (${
      process.env.NODE_ENV === "production" ? "PRODUCTION" : `DEVELOPMENT`
    })`,
    "Accept-Encoding": "gzip, deflate, br",
  },
});

export const getPage = async (pageId: number | undefined) => {
  if (pageId === undefined) {
    return undefined;
  }

  const response = await liquipediaClient.get<LiquipediaPageResponse>(
    `api.php?action=parse&format=json&pageid=${pageId}`
  );

  return response.data.parse;
};
