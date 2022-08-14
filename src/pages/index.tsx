import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import prisma from "@/database";
import { formatDistanceToNow, format } from "date-fns";
import dynamic from "next/dynamic";
import type { Event } from "@prisma/client";
import { getEvents, getTodaysMatches } from "@/clients/rlcsdateClient";
import {
  getCurrentEvent,
  getPreviousEvents,
  getUpcomingEvents,
} from "@/helpers";
import Transfers from "@/components/Transfers";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import MatchListSkeleton from "@/components/MatchList/skeleton";
import { useEffect, useState } from "react";

const DynamicCountdown = dynamic(() => import("@/components/Countdown"), {
  ssr: false,
});

const DynamicMatchList = dynamic(() => import("@/components/MatchList"), {
  ssr: false,
});

const TodaysMatches = ({ event }: { event: Event }) => {
  const { data: matches, isLoading } = useQuery(
    ["todays_matches", event.id],
    () => getTodaysMatches(event.id)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold">{event.name}</h1>
      {isLoading ? (
        <>
          <h2 className="mt-2 h-6 w-36 animate-pulse rounded-sm bg-slate-500 text-lg"></h2>
          <h2 className="p-2"></h2>
          <MatchListSkeleton />
        </>
      ) : matches ? (
        <>
          <h2 className="mt-2 h-6 text-lg">Today&apos;s matches</h2>
          <h2 className="p-2"></h2>
          <DynamicMatchList matches={matches} />
        </>
      ) : (
        <h2 className="mt-2 text-lg">No matches today</h2>
      )}
      <div className="mt-4 text-center">
        <Link href={`event/${event.slug}`}>
          <a className="btn btn-primary btn-md">See complete schedule</a>
        </Link>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: events } = useQuery(["events"], getEvents);

  const [currentEvent, setCurrentEvent] = useState<Event | undefined>(
    undefined
  );
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [previousEvents, setPreviousEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (events && events.length > 0) {
      setCurrentEvent(getCurrentEvent(events));
      setUpcomingEvents(getUpcomingEvents(events));
      setPreviousEvents(getPreviousEvents(events));
    }
  }, [events]);

  return (
    <div>
      {currentEvent ? (
        <TodaysMatches event={currentEvent} />
      ) : (
        upcomingEvents.length > 0 && (
          <div
            className="hero min-h-[20rem] rounded-lg"
            style={{ backgroundImage: `url(rlcs-spring-major-2022.jpg)` }}
          >
            <div className="hero-overlay rounded-lg bg-opacity-80"></div>
            <div className="hero-content flex-col">
              <div className="text-center lg:pl-5">
                <h1 className="text-5xl font-bold">{upcomingEvents[0].name}</h1>
              </div>
              <div className="w-full max-w-sm flex-shrink-0">
                <div className="">
                  <DynamicCountdown endTime={upcomingEvents[0].startDate} />
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <div className="mt-10 flex flex-col justify-between gap-5 lg:flex-row">
        <div className="flex grow flex-col gap-5 lg:basis-4/6">
          <div>
            <div className="rounded-lg bg-neutral py-4 px-6 text-neutral-content">
              <h2 className={"text-md uppercase"}>Upcoming RLCS events</h2>
              <div className="p-2"></div>
              <div>
                {upcomingEvents?.map((event, i) => {
                  const date = new Date(event.startDate);
                  const month = format(date, "MMMM");

                  return (
                    <div className={"mb-5 flex"} key={i}>
                      <div className="mt-1.5">
                        <div className="mr-6 flex h-24 w-20 flex-col items-center justify-center rounded-lg border-2 border-solid">
                          <div className="-mt-1 mb-2 w-full border-b-2 border-solid"></div>
                          <div className="text-2xl font-bold ">
                            {date.getDate()}.
                          </div>
                          <div className="text-xs">{month}</div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 font-bold">{event.name}</div>
                        <Link href={`event/${event.slug}`}>
                          <a className="btn btn-outline btn-sm">
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
            <div className="rounded-lg bg-neutral py-4 px-6 text-neutral-content">
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
                      <div className="mb-2 font-normal">
                        Concluded {distanceToNow}
                      </div>
                      <Link href={`event/${event.slug}`}>
                        <a className="btn btn-outline btn-sm">Go to results</a>
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
            <div className="rounded-lg bg-neutral py-4 px-6 text-neutral-content">
              <h2 className={"text-md uppercase"}>Recent transfers</h2>
              <div className="p-2"></div>
              <Transfers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["events"], async () => {
    return await prisma.event.findMany({
      orderBy: { startDate: "desc" },
      take: 10,
    });
  });

  await queryClient.prefetchQuery(["transfers"], async () => {
    return await prisma.transfer.findMany({
      take: 5,
    });
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      revalidate: 1,
    },
  };
};

export default Home;
