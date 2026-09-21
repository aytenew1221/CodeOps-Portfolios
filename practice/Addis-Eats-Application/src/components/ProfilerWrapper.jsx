/**
 * ProfilerWrapper.jsx
 * This component wraps its children with React's Profiler to measure rendering performance.
 * It logs the rendering duration of each component and keeps track of the slowest observed component.
 */
import { Profiler, useRef } from "react";

export default function ProfilerWrapper({ children }) {
  const slowest = useRef({
    component: "",
    duration: 0,
  });

  function onRender(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) {
    if (actualDuration > slowest.current.duration) {
      slowest.current = {
        component: id,
        duration: actualDuration,
      };
    }

    console.groupCollapsed(
      `[Profiler] ${id} | ${phase} | ${actualDuration.toFixed(2)}ms`,
    );

    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });

    console.log(
      `Slowest observed component: ${
        slowest.current.component
      } (${slowest.current.duration.toFixed(2)}ms)`,
    );

    console.groupEnd();
  }

  return (
    <Profiler id="MenuGrid" onRender={onRender}>
      {children}
    </Profiler>
  );
}
