import { toast } from "react-toastify";
import Cookies, { CookieAttributes } from "js-cookie";
import isObject from "./isObject";
import notifyGenericErr from "./notifyGenericErr";
import isString from "./isString";

const ninetyDays = 90;
const daysIn15Mins = 0.010416;

export default function storeAuthRespData(data: unknown): { ok: boolean } {
  if (!isObject(data)) {
    notifyGenericErr();
    return { ok: false };
  }
  const { refreshToken, accessToken, username } = data;

  if (
    !isString(refreshToken) ||
    !isString(accessToken) ||
    !isString(username)
  ) {
    return { ok: false };
  }
  const refreshTokenSerialized = JSON.stringify(refreshToken);

  const commonOpts: CookieAttributes = {
    sameSite: "Strict",
  };

  Cookies.set("accessToken", accessToken, {
    expires: daysIn15Mins,
    ...commonOpts,
  });
  Cookies.set("refreshToken", refreshTokenSerialized, {
    expires: ninetyDays,
    ...commonOpts,
  });
  Cookies.set("username", username, { ...commonOpts });

  return { ok: true };
}
