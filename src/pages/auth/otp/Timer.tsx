import { useState, useEffect, FC } from "react";

interface TimerProps {
  time?: number;
  className?: string;
  callback: () => void;
  reload?: boolean;
}

const Timer: FC<TimerProps> = ({ time = 180, className, callback, reload }) => {
  const [timeRemaining, setTimeRemaining] = useState(time);

  const handleRequest = () => {
    setTimeRemaining(time);
    callback();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reload]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className={className}>
      {timeRemaining ? (
        <div className="text-lg font-semibold">
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </div>
      ) : (
        <p className="text-gray-500">
          Didn't receive the code?{" "}
          <span
            onClick={handleRequest}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Request again
          </span>
        </p>
      )}
    </div>
  );
};

export default Timer;
