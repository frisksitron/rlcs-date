import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Event, Match } from "@prisma/client";
import prisma from "@/database";
import { EventResponse } from "@/pages/api/event/[id]";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import { ParsedUrlQuery } from "querystring";
import { formatISO } from "date-fns";
import * as R from "remeda";
import MatchList from "@/components/MatchList";

type EventPageProps = {
  eventId: string;
  fallback: {
    [key: string]: EventResponse;
  };
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

const fetcher = async (url: string, id: number) => {
  const res = await fetch(url + id);
  if (!res.ok) {
    throw Error("Error fetching event");
  }
  const data: EventResponse = await res.json();
  return data;
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

const EventDetails = ({ eventId }: { eventId: string }) => {
  const { data } = useSWR(["/api/event/", eventId], fetcher);
  return (
    <div>
      {data && (
        <div className={"col-span-3"}>
          <div className={"mb-10"}>
            <h2 className={"text-3xl mb-2"}>{data.name}</h2>
            <a
              href={data?.liquipediaUrl}
              className={"link text-sm"}
              target={"_blank"}
              rel="noreferrer"
            >
              Liquipedia page
            </a>
          </div>

          <Schedules matches={data.matches} />
        </div>
      )}
    </div>
  );
};

const Event: NextPage<EventPageProps> = ({ eventId, fallback }) => {
  return (
    <SWRConfig value={{ fallback }}>
      <EventDetails eventId={eventId} />
    </SWRConfig>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params as Params;
  const event = await prisma.event.findFirst({
    where: { slug },
    include: { matches: true },
  });

  return {
    props: {
      eventId: event?.id,
      fallback: {
        [unstable_serialize(["/api/event/", event?.id])]: {
          event,
        },
      },
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
