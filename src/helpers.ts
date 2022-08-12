import type { Event } from "@prisma/client";

const NameToShortNameMap = new Map([
  ["Team BDS", "BDS"],
  ["Endpoint", "END"],
  ["FaZe Clan", "FAZE"],
  ["Team Falcons", "FLCN"],
  ["FURIA Esports", "FUR"],
  ["G2 Esports", "G2"],
  ["Gaimin Gladiators", "GLA"],
  ["Karmine Corp", "KC"],
  ["Pioneers", "KCP"],
  ["Moist Esports", "MST"],
  ["Oxygen Esports", "OG"],
  ["PWR", "PWR"],
  ["Spacestation Gaming", "SSG"],
  ["Team Liquid", "TL"],
  ["Team Secret", "TS"],
  ["Version1", "V1"],
  ["Tokyo Verdy Esports", "VE"],
  ["Orlando Pirates Exdee", "OP"],
  ["Renegades", "RNG"],
  ["DeToNator", "DTN"],
  ["The Club", "CLUB"],
  ["Dignitas", "DIG"],
  ["OpTic Gaming", "OG"],
  ["Veloce Esports", "VEL"],
  ["01 Esports", "01"],
  ["SMPR Esports", "SMPR"],
  ["Evil Geniuses", "EG"],
  ["Bravado Gaming", "BVD"],
  ["NRG Esports", "NRG"],
]);

export const toShortName = (name: string) => {
  const shortName = NameToShortNameMap.get(name);
  if (shortName) {
    return shortName;
  }
  return name;
};

export const getCurrentEvent = (events: Event[]) => {
  const now = new Date();
  const currentEvent = events.find((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return now >= startDate && now <= endDate;
  });
  return currentEvent;
};

export const getUpcomingEvents = (events: Event[]): Event[] => {
  const now = new Date();
  return events.filter((event) => new Date(event.startDate) > now);
};

export const getPreviousEvents = (events: Event[]): Event[] => {
  const now = new Date();
  return events
    .filter((event) => new Date(event.startDate) < now)
    .filter((event) => now > new Date(event.endDate));
};
