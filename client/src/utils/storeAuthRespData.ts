import { toast } from "react-toastify";
import Cookies, { CookieAttributes } from "js-cookie";
import isObject from "./isObject";
import notifyGenericErr from "./notifyGenericErr";
import isString from "./isString";
import { TAuthResp } from "@shared/types";

const ninetyDays = 90;
const daysIn15Mins = 0.010416;

const commonOpts: CookieAttributes = {
  sameSite: "Strict",
};

export default function storeAuthRespData(data: TAuthResp) {
  const { refreshToken, accessToken, username } = data;

  const refreshTokenSerialized = JSON.stringify(refreshToken);

  Cookies.set("accessToken", accessToken, {
    expires: daysIn15Mins,
    ...commonOpts,
  });
  Cookies.set("refreshToken", refreshTokenSerialized, {
    expires: ninetyDays,
    ...commonOpts,
  });
  if (username) {
    Cookies.set("username", username, { ...commonOpts });
  }
}
