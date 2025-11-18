import { Notification } from "@/src/types/notification.types";
import Link from "next/link";
import * as React from "react";
// Assuming import of CONFIG is handled here:
// import { CONFIG } from "@/src/constants/ui";

// C067 Fix: Use constant from CONFIG object
const DEFAULT_LOCALE = CONFIG.DEFAULT_LOCALE;

interface NotificationItemProps {
  n: Notification;
}

const RenderNotificationItem = ({
  n,
}: NotificationItemProps): React.JSX.Element => {
  const content = (
    <>
      {" "}
      <p
        className={`text-sm text-secondary-foreground ${
          n.isSeen ? "font-medium" : "font-bold"
        }`}
      >
        {n.title}{" "}
      </p>
      <p className="text-sm text-muted-foreground">{n.message}</p>{" "}
      <p className="text-xs text-gray-400 mt-1">
        {/* C067: Using named constant DEFAULT_LOCALE */}{" "}
        {new Date(n.createdAt).toLocaleString(DEFAULT_LOCALE)}{" "}
      </p>{" "}
    </>
  );

  return n.link ? (
    <Link
      href={n.link}
      className={`${
        n.isSeen ? "bg-white" : "bg-muted"
      } block px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors last:rounded-b-xl`}
    >
      {content}{" "}
    </Link>
  ) : (
    <div
      className={`${
        n.isSeen ? "bg-white" : "bg-muted"
      } px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors last:rounded-b-xl`}
    >
      {content}{" "}
    </div>
  );
};

export default RenderNotificationItem;
