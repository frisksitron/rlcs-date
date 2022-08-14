import axios from "axios";
import { EventResponse } from "@/pages/api/event/[id]";
import { MatchesResponse } from "@/pages/api/event/[id]/matches";
import { TransfersResponse } from "@/pages/api/transfers";
import { LeaderboardResponse } from "@/pages/api/leaderboard";
import { EventsResponse } from "@/pages/api/event";

const rlcsdateClient = axios.create();

export const getEvents = async () => {
  const { data } = await rlcsdateClient.get<EventsResponse>("/api/event");

  return data.events;
};

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
