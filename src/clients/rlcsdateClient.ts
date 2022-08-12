import axios from "axios";
import { EventResponse } from "@/pages/api/event/[id]";
import { MatchesResponse } from "@/pages/api/event/[id]/matches";
import { TransfersResponse } from "@/pages/api/transfers";
import { LeaderboardResponse } from "@/pages/api/leaderboard";

const rlcsdateClient = axios.create({
  headers: {
    "User-Agent": `rlcs.date/1.0 (${
      process.env.NODE_ENV === "production" ? "PRODUCTION" : `DEVELOPMENT`
    })`,
  },
});

rlcsdateClient.defaults.baseURL = process.env.API_URL || process.env.VERCEL_URL;

export const getEvent = async (eventId: string) => {
  const response = await rlcsdateClient.get<EventResponse>(
    `/api/event/${eventId}`
  );

  return response.data.event;
};

export const getEventMatches = async (eventId: string) => {
  const response = await rlcsdateClient.get<MatchesResponse>(
    `/api/event/${eventId}/matches`
  );

  return response.data.matches;
};

export const getTodaysMatches = async (eventId: string | undefined) => {
  if (!eventId) {
    return [];
  }

  const response = await rlcsdateClient.get<MatchesResponse>(
    `/api/event/${eventId}/today`
  );

  return response.data.matches;
};

export const getTransfers = async () => {
  const response = await rlcsdateClient.get<TransfersResponse>(
    `/api/transfers`
  );

  return response.data.transfers;
};

export const getLeaderboard = async () => {
  const response = await rlcsdateClient.get<LeaderboardResponse>(
    `/api/leaderboard`
  );

  return response.data.leaderboard;
};
