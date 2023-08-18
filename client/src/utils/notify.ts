import React from "react";
import { toast } from "react-toastify";

export default function notify(notificationContent: string | React.ReactNode) {
  toast(notificationContent);
}

export function notifyGenericErr() {
  toast("Something went wrong. Try again later");
}
