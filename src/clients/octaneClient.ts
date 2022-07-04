import { fromOctaneMatch } from "@/mappers";
import axios from "axios";
import { isSameDay } from "date-fns";
import * as R from "remeda";

type OctaneEventsResponse = {
  events: OctaneEvent[];
};

export type OctaneEvent = {
  _id: string;
  slug: string;
  name: string;
  startDate: Date;
  endDate: Date;
  region: string;
  mode: number;
  prize: Prize;
  tier: string;
  image: string;
  groups: string[];
  stages: Stage[];
};

export type Prize = {
  amount: number;
  currency: string;
};

export type Location = {
  venue: string;
  city: string;
  country: string;
};

export type Stage = {
  _id: number;
  name: string;
  region: string;
  startDate: Date;
  endDate: Date;
  prize: Prize;
  liquipedia: string;
  lan: boolean;
  location: Location;
};

export type OctaneMatchesResponse = {
  matches: OctaneMatch[];
};

export type OctaneMatch = {
  _id: string;
  slug: string;
  event: OctaneEvent;
  stage: Stage;
  date: string;
  blue: Team;
  orange: Team;
  number: number;
  reverseSweep?: boolean;
  reverseSweepAttempt?: boolean;
};

type Team = {
  score?: number;
  winner?: boolean;
  team: TeamWithStats;
};

type TeamWithStats = {
  team: TeamDetails;
};

type TeamDetails = {
  _id: string;
  slug: string;
  name: string;
  region?: string;
  image: string;
  relevant?: boolean;
};

const octaneClient = axios.create({
  baseURL: "https://zsr.octane.gg/",
  headers: {
    "User-Agent": `rlcs.date/1.0 (${
      process.env.NODE_ENV === "production" ? "PRODUCTION" : `DEVELOPMENT`
    })`,
  },
});

export const getEvents = async (after: string, group: string) => {
  const response = await octaneClient.get<OctaneEventsResponse>(
    `events?after=${after}&group=${group}`
  );

  return response.data.events;
};

export const getEventMatches = async (eventId: string, stageId: string) => {
  const response = await octaneClient.get<OctaneMatchesResponse>(
    `matches?event=${eventId}&stage=${stageId}`
  );

  return response.data.matches;
};

export const getTodaysMatches = async (eventId: string, stageId: string) => {
  const response = await octaneClient.get<OctaneMatchesResponse>(
    `matches?event=${eventId}&stage=${stageId}`
  );
  const mapped = response.data.matches.map(fromOctaneMatch);
  const todaysMatches = R.pipe(
    mapped,
    R.filter((x) => isSameDay(new Date((x.startTime ??= "0")), new Date())),
    R.sortBy((x) => new Date((x.startTime ??= "0")))
  );
  return todaysMatches;
};
