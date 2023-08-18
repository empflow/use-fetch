"use client";
import { TAuthResp, TErrCode } from "@shared/types";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import notify, { notifyGenericErr } from "@/utils/notify";
import isOnline from "@/utils/isOnline";
import storeAuthRespData from "@/utils/storeAuthRespData";
import isValidAuthResp from "@/utils/isValidAuthResp";
import notifyGenericErr from "@/utils/notifyGenericErr";
import useGetContext from "./useGetContext";
import { GlobalContext } from "@/app/GlobalContextProvider";

type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options";

interface Params {
  url: string;
  method: HttpMethod;
  body?: any;
  opts?: {
    fetchImmediately?: boolean;
    persistDataWhileFetching?: boolean;
    withAuth?: boolean;
  };
}

export default function useFetch<T extends unknown>({
  url,
  method,
  body,
  opts,
}: Params) {
  const { notify } = useGetContext(GlobalContext);
  const {
    fetchImmediately = true,
    persistDataWhileFetching = true,
    withAuth = true,
  } = opts ?? {};

  const [err, setErr] = useState<AxiosResponse | null>(null);
  const [data, setData] = useState<null | T>(null);
  const [loading, setLoading] = useState(false);
  const genericErrContent = "Something went wrong. Try again later";

  useEffect(() => {
    (async () => {
      if (fetchImmediately) await fetch();
    })();
  }, []);

  async function fetch(customBody?: unknown) {
    fetchSetup();
    if (!notifyIfCantFetch().ok) return;

    if (withAuth) await fetchWithAuth(customBody);
    else await fetchWithoutAuth(customBody);

    fetchTeardown();
  }

  function fetchSetup() {
    if (!persistDataWhileFetching) setData(null);
    setErr(null);
    setLoading(true);
  }

  function notifyIfCantFetch(): { ok: boolean } {
    if (isOnline()) return { ok: true };

    setLoading(false);
    notify("noInternet", "no internet");
    return { ok: false };
  }

  function fetchTeardown() {
    setLoading(false);
  }

  async function fetchWithAuth(customBody?: unknown) {
    const authHeader = await getAuthHeader();
    if (!authHeader) return;

    try {
      const resp = await axios({
        url,
        method,
        headers: { Authorization: authHeader },
        data: customBody ?? body,
      });
      setData(resp.data);
    } catch (err) {
      handleFetchWithAuthErr(err);
    }
  }

  function handleFetchWithAuthErr(err: unknown) {
    if (!isAxiosError(err) || !err.response) {
      return notifyGenericErr();
    }
    setErr(err.response);
  }

  async function getAuthHeader(): Promise<string | null> {
    let accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      const newTokens = await getAndStoreNewTokens();
      if (!newTokens) return null;
      accessToken = newTokens.accessToken;
    }
    return `Bearer ${accessToken}`;
  }

  async function getAndStoreNewTokens(): Promise<TAuthResp | null> {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      notify("notSignedIn", "not signed in");
      return null;
    }

    try {
      const data = await getNewTokens(refreshToken);
      if (!data) return null;
      storeAuthRespData(data);
      return data;
    } catch (err) {
      handleGetAndStoreNewTokensErr(err);
      return null;
    }
  }

  /**
   *
   * @param refreshTokenFromCookies must be serialized (Pass the token as is it in cookies, don't JSON.parse() it)
   */
  async function getNewTokens(refreshTokenFromCookies: string) {
    const refreshTokenDeserialized = JSON.parse(refreshTokenFromCookies);
    const resp = await axios({
      url: "/auth/get-new-tokens",
      method: "post",
      data: { refreshToken: refreshTokenDeserialized },
    });
    if (!isValidAuthResp(resp.data)) {
      notifyGenericErr();
      return null;
    }
    return resp.data;
  }

  function handleGetAndStoreNewTokensErr(err: unknown) {
    if (!isAxiosError(err) || !err.response) {
      notifyGenericErr();
    }
    notify("notSignedIn", "not signed in");
  }

  async function fetchWithoutAuth(customBody?: unknown) {
    try {
      const resp = await axios({ url, method, data: customBody ?? body });
      setData(resp.data);
    } catch (err) {
      handleFetchWithoutAuthErr(err);
    }
  }

  function handleFetchWithoutAuthErr(err: unknown) {
    if (isAxiosError(err) && err.response) {
      setErr(err.response);
    } else {
      notifyGenericErr();
    }
  }

  return { err, data, loading, setLoading, fetch };
}
