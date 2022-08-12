import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Event, Match } from "@prisma/client";
import prisma from "@/database";
import { EventResponse } from "@/pages/api/event/[id]";
import useSWR from "swr";
import { ParsedUrlQuery } from "querystring";
import { formatISO } from "date-fns";
import * as R from "remeda";
import MatchList from "@/components/MatchList";
import { getEventMatches } from "@/clients/octaneClient";

type EventPageProps = {
  eventId: string;
  eventFallback: Event;
  matchesFallback: Match[];
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

const fetchEvent = async (url: string, id: number) => {
  const res = await fetch(url + id);
  if (!res.ok) {
    throw Error("Error fetching event");
  }
  const data: EventResponse = await res.json();
  return data;
};

const fetchMatches = async (_url: string, eventId: string) => {
  const [event, stage] = eventId.split("-");
  const matches = await getEventMatches(event, stage);
  return matches;
};

const groupByDate = (matches: Match[] | undefined) => {
  if (!matches || matches.length === 0) {
    return undefined;
  }

  const sorted = R.sortBy(matches, [
    (x) => new Date((x.startTime ??= "0")).getTime(),
    "asc",
  ]);

  return R.groupBy(sorted, (match) => {
    if (!match.startTime) return "TBD";
    const date = new Date(match.startTime);
    return formatISO(date, { representation: "date" });
  });
};

const Schedules = ({ matches }: { matches: Match[] }) => {
  const schedule = groupByDate(matches);

  if (!schedule) {
    return <div>Sorry, the schedule is not available yet.</div>;
  }

  return (
    <>
      {Object.entries(schedule).map(([dateString, matches], i) => {
        return (
          <div key={i}>
            <div className="divider">
              Day {i + 1} ({dateString})
            </div>
            <div className="overflow-x-auto">
              <MatchList matches={matches} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const Event: NextPage<EventPageProps> = ({
  eventId,
  eventFallback,
  matchesFallback,
}) => {
  const { data: event } = useSWR(["/api/event/", eventId], fetchEvent, {
    fallbackData: eventFallback,
  });
  const { data: matches } = useSWR(
    "matches",
    (url) => fetchMatches(url, eventId),
    {
      fallbackData: matchesFallback,
    }
  );

  return (
    <div>
      {event && (
        <div className={"col-span-3"}>
          <div className={"mb-10"}>
            <h2 className={"text-3xl mb-2"}>{event.name}</h2>
            <a
              href={event?.liquipediaUrl}
              className={"link text-sm"}
              target={"_blank"}
              rel="noreferrer"
            >
              Liquipedia page
            </a>
          </div>

          <Schedules matches={matches || []} />
        </div>
      )}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Params;
  const event = await prisma.event.findFirst({
    where: { slug },
  });

  const matches: Match[] = [];

  if (event) {
    const todaysMatches = await fetchMatches("matches", event.id);
    matches.push(...todaysMatches);
  }

  return {
    props: {
      eventId: event?.id,
      eventFallback: event,
      matchesFallback: matches,
      revalidate: 1,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await prisma.event.findMany();
  const slugs = [...events.map((x) => x.slug)];
  const paths = slugs.map((slug) => {
    return {
      params: { slug },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export default Event;
