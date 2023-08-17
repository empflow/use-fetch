import { FormEvent, useEffect, useState } from "react";
import useFetch from "./useFetch";
import storeAuthRespData from "./utils/storeAuthRespData";

function App() {
  const [email, setEmail] = useState("Hayley.Schulist@yahoo.com");
  const [pwd, setPwd] = useState("GffIiAUR_rv7urd0#");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { data, err, loading, setLoading, fetch } = useFetch({
    url: "auth/sign-in",
    method: "post",
    body: {
      email,
      password: pwd,
      captchaBypassToken: import.meta.env.VITE_CAPTCHA_BYPASS_TOKEN,
    },
    opts: { fetchImmediately: false, withAuth: false },
  });

  useEffect(() => {
    if (!hasSubmitted) return;
    storeAuthRespData(data);
  }, [data]);

  async function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    setHasSubmitted(true);
    await fetch();
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

export default App;
