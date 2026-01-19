import { useEffect, useState } from "react";

type Props = {
  value: number;
  duration?: number; // ms
  className?: string;
};

export function AnimatedScore({
  value,
  duration = 600,
  className = "",
}: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (value - start) * progress);
      setDisplay(current);

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}
