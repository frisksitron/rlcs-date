import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import type { Event, Match } from "@prisma/client";
import prisma from "@/database";
import { ParsedUrlQuery } from "querystring";
import { formatISO } from "date-fns";
import * as R from "remeda";
import MatchList from "@/components/MatchList";
import { getEventMatches } from "@/clients/rlcsdateClient";
import { getEventMatches as getEventMatchesFromOctane } from "@/clients/octaneClient";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

type EventPageProps = {
  event: Event;
};

interface Params extends ParsedUrlQuery {
  slug: string;
}

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

const Event: NextPage<EventPageProps> = ({ event }) => {
  const { data: matches } = useQuery(["matches", event.id], () =>
    getEventMatches(event.id)
  );

  return (
    <div>
      <div className={"col-span-3"}>
        <div className={"mb-10"}>
          <h2 className={"mb-2 text-3xl"}>{event.name}</h2>
          <a
            href={event.liquipediaUrl}
            className={"link text-sm"}
            target={"_blank"}
            rel="noreferrer"
          >
            Liquipedia page
          </a>
        </div>

        <Schedules matches={matches || []} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  const { slug } = context.params as Params;

  const event = await prisma.event.findFirst({
    where: { slug },
  });

  if (event) {
    await queryClient.prefetchQuery(["matches", event.id], () =>
      getEventMatchesFromOctane(event.id)
    );

    return {
      props: {
        event,
        dehydratedState: dehydrate(queryClient),
        revalidate: 1,
      },
    };
  }

  return {
    notFound: true,
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
    fallback: "blocking",
  };
};

export default Event;
