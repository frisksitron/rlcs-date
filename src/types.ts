import { Match, Event } from "@prisma/client";

export type EventWithMatches = Event & {
  matches: Match[];
};
