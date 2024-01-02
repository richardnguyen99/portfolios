import * as React from "react";

const MemoDate = React.memo<{ date: string }>(({ date }) => {
  return <span>{date}</span>;
});

const Clock: React.FC = () => {
  const [date, setDate] = React.useState(new Date());

  const tick = () => {
    setDate(new Date());
  };

  React.useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div className="w-44">
      <div className="flex items-center justify-center gap-2">
        <MemoDate
          date={date.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        />
        <span>
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </div>
    </div>
  );
};

export default Clock;
