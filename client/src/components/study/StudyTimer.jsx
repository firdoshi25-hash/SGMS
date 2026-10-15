import { useEffect, useRef, useState } from "react";
import "../../styles/StudyTimer.css";

function StudyTimer({ onComplete }) {
  const focusLength = 25 * 60;
  const [seconds, setSeconds] = useState(focusLength);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const completionHandler = useRef(onComplete);

  useEffect(() => { completionHandler.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const timer = setInterval(() => setSeconds((remaining) => Math.max(remaining - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
      setIsComplete(true);
      completionHandler.current?.(25);
    }
  }, [seconds, isRunning]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formatTime = (value) => String(value).padStart(2, "0");

  function start() {
    if (isComplete) {
      setSeconds(focusLength);
      setIsComplete(false);
    }
    setIsRunning(true);
  }

  function reset() {
    setIsRunning(false);
    setIsComplete(false);
    setSeconds(focusLength);
  }

  return (
    <section className="study-timer">
      <div className="timer-header">
        <div><span>Study Session</span><h2>Focus Timer</h2></div>
        <span className="timer-mode">Pomodoro</span>
      </div>
      <div className="timer-display" aria-live="off">{formatTime(minutes)}:{formatTime(remainingSeconds)}</div>
      <p className="timer-message" role="status">
        {isComplete ? "Focus interval complete." : isRunning ? "Stay focused and keep going." : "Ready to start your study session?"}
      </p>
      <div className="timer-buttons">
        {isRunning
          ? <button className="timer-pause" type="button" onClick={() => setIsRunning(false)}>Pause</button>
          : <button className="timer-start" type="button" onClick={start}>{isComplete ? "Start again" : seconds < focusLength ? "Resume" : "Start"}</button>}
        <button className="timer-reset" type="button" onClick={reset}>Reset</button>
      </div>
    </section>
  );
}

export default StudyTimer;