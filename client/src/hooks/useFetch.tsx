"use client";
import {
  hideNotSignedInPopup,
  showNotSignedInPopup,
  toggleNotSignedInPopupOpen,
} from "@/redux/slices/auth";
import useAppDispatch from "./useAppDispatch";
import { AxiosError, AxiosResponse, isAxiosError } from "axios";
import axios from "../utils/axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import isOnline from "@/utils/isOnline";

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
  const dispatch = useAppDispatch();
  const {
    fetchImmediately = true,
    persistDataWhileFetching = true,
    withAuth = true,
  } = opts ?? {};

  const [err, setErr] = useState<AxiosResponse | null>(null);
  const [data, setData] = useState<null | T>(null);
  const [loading, setLoading] = useState(false);
  const notSignedInMsg = (
    <>
      <span>You are not signed in.</span> <a href="/sign-in">Sign in here</a>
    </>
  );

  useEffect(() => {
    if (fetchImmediately) fetch();
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
    toast("Please check your internet connection");
    return { ok: false };
  }

  async function fetchWithAuth(customBody?: unknown) {
    // TODO: handle expired token errors properly
    try {
      const accessToken = getAccessToken();
      if (!accessToken) return;
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshTokens() {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) return toast(notSignedInMsg);

    try {
      const refreshTokenDeserialized = JSON.parse(refreshToken);
      const resp = await axios({
        url: "http://localhost:3001/auth/get-new-tokens",
        method,
        data: { refreshToken },
      });
    } catch (err) {
      console.error(err);
    }
  }

  function fetchTeardown() {
    setLoading(false);
  }

  function getAccessToken() {
    return Cookies.get("accessToken");
  }

  function getAuthHeader(accessToken: string) {
    return `Bearer ${accessToken}`;
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
    if (isAxiosError(err)) {
      if (!err.response) return toast("something went wrong");
      setErr(err.response);
    } else {
      console.log("hi");
      toast("something went completely fucking wrong");
    }
  }

  return { err, data, loading, setLoading, fetch };
}
