import slugify from "@sindresorhus/slugify";
import { Event, Match } from "@prisma/client";
import { OctaneEvent, OctaneMatch, Stage } from "@/clients/octaneClient";

export const fromOctaneEvent = (event: OctaneEvent): Event[] => {
  return event.stages?.map((stage: Stage) => {
    return {
      id: event._id + "-" + stage._id,
      name: event.name + " - " + stage.name,
      slug: slugify(event.name + "-" + stage.name),
      startDate: stage.startDate.toString(),
      endDate: stage.endDate.toString(),
      liquipediaUrl: stage.liquipedia,
      region: stage.region ?? "",
      isLan: stage.lan ?? false,
    };
  });
};

export const fromOctaneMatch = (match: OctaneMatch): Match => {
  return {
    id: match._id,
    startTime: match.date,
    blueTeam: match.blue?.team?.team?.name ?? "TBD",
    orangeTeam: match.orange?.team?.team?.name ?? "TBD",
    eventId: match.event._id + "-" + match.stage._id,
    blueScore: match.blue?.score ?? null,
    orangeScore: match.orange?.score ?? null,
  };
};
