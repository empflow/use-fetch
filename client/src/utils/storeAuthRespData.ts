import { toast } from "react-toastify";
import Cookies, { CookieAttributes } from "js-cookie";

const ninetyDays = 90;
const daysIn15Mins = 0.010416;

export default function storeAuthRespData(data: any) {
  const { refreshToken, accessToken, username } = data;

  if (!refreshToken || !accessToken || !username) {
    return toast("some data from auth resp is not present");
  }
  const refreshTokenSerialized = JSON.stringify(data.refreshToken);

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
}
