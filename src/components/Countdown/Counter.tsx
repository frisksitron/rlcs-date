import React from "react";
import { twMerge } from "tailwind-merge";

export type CountdownProps = React.HTMLAttributes<HTMLSpanElement> & {
  value: number;
};

const Countdown = ({ value, className, ...props }: CountdownProps) => {
  const classes = twMerge("countdown", className);

  const displayedValue = Math.min(99, Math.max(0, value));
  const countdownStyle: Record<string, number> = { "--value": displayedValue };

  return (
    <span role="timer" {...props} className={classes}>
      <span style={countdownStyle} />
    </span>
  );
};

export default Countdown;
