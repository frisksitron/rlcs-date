import { useCountdown } from "@/hooks/useCountdown";
import Counter from "./Counter";

const Countdown = ({ title, endTime }: { title?: string; endTime: string }) => {
  const [days, hours, minutes, seconds] = useCountdown(endTime);

  return (
    <div>
      {title && (
        <>
          <h2 className="text-center uppercase">{title}</h2>
          <div className="p-2"></div>
        </>
      )}
      <div className="flex justify-around text-center">
        <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
          <Counter className="font-mono text-5xl" value={days} />
          days
        </div>
        <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
          <Counter className="font-mono text-5xl" value={hours} />
          hours
        </div>
        <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
          <Counter className="font-mono text-5xl" value={minutes} />
          min
        </div>
        <div className="rounded-box hidden flex-col bg-neutral p-2 text-neutral-content md:flex ">
          <Counter className="font-mono text-5xl" value={seconds} />
          sec
        </div>
      </div>
    </div>
  );
};

export default Countdown;
