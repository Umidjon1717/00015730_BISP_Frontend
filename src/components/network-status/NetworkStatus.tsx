import useOnlineStatus from "@/hooks/useOnlineStatus";
import "./NetworkStatus.scss";

const NetworkStatus = () => {
  const { online, firstEnter } = useOnlineStatus();
  const statusClass = online ? "bg-green-500" : "bg-red-500";

  return (
    firstEnter && (
      <p
        className={`text-center fixed top-0 left-0 h-6 flex items-center justify-center z-[101] w-full text-white text-sm ${statusClass} ${
          online ? "animete-hide" : ""
        }`}
      >
        {online ? "online" : "offline"}
      </p>
    )
  );
};

export default NetworkStatus;
