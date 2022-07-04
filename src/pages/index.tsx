import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import prisma from "@/database";
import { formatDistanceToNow, format } from "date-fns";
import useSWR from "swr";
import dynamic from "next/dynamic";
import type { Event, Match, Transfer } from "@prisma/client";
import { EventWithMatches } from "@/types";
import MatchList from "@/components/MatchList";
import { getTodaysMatches } from "@/clients/octaneClient";
import {
  getCurrentEvent,
  getPreviousEvents,
  getUpcomingEvents,
} from "@/helpers";
import Transfers from "@/components/Transfers";

const DynamicCountdown = dynamic(() => import("@/components/Countdown"), {
  ssr: false,
});

type HomeProps = {
  currentEvent: EventWithMatches | null;
  upcomingEvents: Event[];
  previousEvents: Event[];
  matches: Match[];
  transfers: Transfer[];
};

const fetchMatches = async (_url: string, eventId: string) => {
  const [event, stage] = eventId.split("-");
  const matches = await getTodaysMatches(event, stage);
  return matches;
};

const Home: NextPage<HomeProps> = ({
  currentEvent,
  upcomingEvents,
  previousEvents,
  matches,
  transfers,
}) => {
  const firstUpcomingEvent = upcomingEvents[0];
  const { data } = useSWR(
    "matches",
    (url) => fetchMatches(url, currentEvent?.id!),
    {
      fallbackData: matches,
    }
  );
  return (
    <div>
      {currentEvent ? (
        <div>
          <h1 className="text-2xl font-bold">{currentEvent?.name}</h1>
          <h2 className="text-lg">Todays matches</h2>
          <h2 className="p-2"></h2>
          <MatchList matches={data!} />
        </div>
      ) : (
        <div
          className="hero min-h-[20rem] rounded-lg"
          style={{ backgroundImage: `url(rlcs-spring-major-2022.jpg)` }}
        >
          <div className="hero-overlay rounded-lg bg-opacity-80"></div>
          <div className="hero-content flex-col">
            <div className="text-center lg:pl-5">
              <h1 className="text-5xl font-bold">{firstUpcomingEvent?.name}</h1>
            </div>
            <div className="flex-shrink-0 w-full max-w-sm">
              <div className="">
                <DynamicCountdown endTime={firstUpcomingEvent?.startDate} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between gap-5 mt-10">
        <div className="flex flex-col gap-5 lg:basis-4/6 grow">
          <div>
            <div className="py-4 px-6 bg-neutral text-neutral-content rounded-lg">
              <h2 className={"text-md uppercase"}>Upcoming RLCS events</h2>
              <div className="p-2"></div>
              <div>
                {upcomingEvents?.map((event, i) => {
                  const date = new Date(event.startDate);
                  const month = format(date, "MMMM");

                  return (
                    <div className={"mb-5 flex"} key={i}>
                      <div className="mt-1.5">
                        <div className="flex flex-col items-center justify-center w-20 h-24 border-solid border-2 rounded-lg mr-6">
                          <div className="border-solid border-b-2 -mt-1 mb-2 w-full"></div>
                          <div className="text-2xl font-bold ">
                            {date.getDate()}.
                          </div>
                          <div className="text-xs">{month}</div>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold mb-2">{event.name}</div>
                        <Link href={`event/${event.slug}`}>
                          <a className="btn btn-sm btn-outline">
                            Go to schedule
                          </a>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <div className="py-4 px-6 bg-neutral text-neutral-content rounded-lg">
              <h2 className={"text-md uppercase"}>Concluded Events</h2>
              <div className="p-2"></div>
              <div>
                {previousEvents?.map((event, i) => {
                  const distanceToNow = formatDistanceToNow(
                    new Date(event.endDate),
                    { addSuffix: true }
                  );

                  return (
                    <div className={"mb-5"} key={i}>
                      <div className="font-bold">{event.name} </div>
                      <div className="font-normal mb-2">
                        Concluded {distanceToNow}
                      </div>
                      <Link href={`event/${event.slug}`}>
                        <a className="btn btn-sm btn-outline">Go to results</a>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="basis-0 lg:basis-2/6">
          <div>
            <div className="py-4 px-6 bg-neutral text-neutral-content rounded-lg">
              <h2 className={"text-md uppercase"}>Recent transfers</h2>
              <div className="p-2"></div>
              <Transfers fallback={transfers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    take: 10,
  });
  const currentEvent = getCurrentEvent(events);
  const matches: Match[] = [];

  if (currentEvent) {
    const todaysMatches = await fetchMatches("matches", currentEvent?.id);
    matches.push(...todaysMatches);
  }

  const transfers = await prisma.transfer.findMany({
    take: 5,
  });

  return {
    props: {
      currentEvent: currentEvent ?? null,
      upcomingEvents: getUpcomingEvents(events),
      previousEvents: getPreviousEvents(events),
      matches,
      transfers,
      revalidate: 1,
    },
  };
};

export default Home;
