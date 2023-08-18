"use client";
import useFetch from "@/hooks/useFetch";
import isValidAuthResp from "@/utils/isValidAuthResp";
import notifyGenericErr from "@/utils/notify";
import storeAuthRespData from "@/utils/storeAuthRespData";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("Hayley.Schulist@yahoo.com");
  const [pwd, setPwd] = useState("GffIiAUR_rv7urd0#");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { data, err, loading, setLoading, fetch } = useFetch({
    url: "auth/sign-in",
    method: "post",
    body: {
      email,
      password: pwd,
      captchaBypassToken: process.env.NEXT_PUBLIC_CAPTCHA_BYPASS_TOKEN,
    },
    opts: { fetchImmediately: false, withAuth: false },
  });

  useEffect(() => {
    if (!hasSubmitted) return;
    if (!isValidAuthResp(data)) {
      return notifyGenericErr();
    }
    storeAuthRespData(data);
    location.replace("/dashboard");
  }, [data]);

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    await fetch();
    setHasSubmitted(true);
  }
  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        password
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <br />
        <button type="submit">{loading ? "Loading..." : "Submit"}</button>
      </form>
    </div>
  );
}
