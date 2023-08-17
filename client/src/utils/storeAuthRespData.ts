import { toast } from "react-toastify";
import Cookies from "js-cookie";

const ninetyDays = 90;
const daysIn15Mins = 0.010416;

export default function storeAuthRespData(data: any) {
  const { refreshToken, accessToken, username } = data;

  if (!refreshToken || !accessToken || !username) {
    return toast("some data from auth resp is not present");
  }
  const refreshTokenSerialized = JSON.stringify(data.refreshToken);

  Cookies.set("accessToken", accessToken, {
    expires: daysIn15Mins,
  });
  Cookies.set("refreshToken", refreshTokenSerialized, { expires: ninetyDays });
  Cookies.set("username", username);
}
