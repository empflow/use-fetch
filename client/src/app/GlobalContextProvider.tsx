"use client";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

interface TNotifications {
  notSignedIn: boolean;
  noInternet: boolean;
}

type TNotifyType = (
  notifications: keyof TNotifications,
  content: string | React.ReactNode
) => void;

interface TGlobalContextValue {
  notify: TNotifyType;
}
type TGlobalContext = null | TGlobalContextValue;

export const GlobalContext = createContext<TGlobalContext>(null);

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState({
    notSignedIn: false,
    noInternet: false,
  });

  function notify(
    notification: keyof TNotifications,
    content: string | React.ReactNode
  ) {
    console.log(notifications[notification]);
    if (notifications[notification]) return;

    setNotifications((prev) => ({ ...prev, [notification]: true }));
    toast(content, {
      onClose: () => {
        setNotifications((prev) => ({ ...prev, [notification]: false }));
      },
    });
  }

  return (
    <GlobalContext.Provider value={{ notify }}>
      {children}
    </GlobalContext.Provider>
  );
}
