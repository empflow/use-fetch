import Link from "next/link";
import useAppSelector from "@/hooks/useAppSelector";
import useAppDispatch from "@/hooks/useAppDispatch";
import { hideNotSignedInPopup } from "@/redux/slices/auth";

export default function NotSignedInPopup() {
  const show = useAppSelector((state) => state.auth.notSignedInPopupOpen);
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className={`${
          show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        } rounded z-10 bg-white flex flex-col p-2 max-w-[400px] w-full fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 border border-gray-500 duration-200`}
      >
        <p>You are not signed in</p>
        <Link href="/">
          <button>Sign in</button>
        </Link>
      </div>
      <div
        className={`${
          show
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } absolute top-0 bottom-0 left-0 right-0 bg-black/50 duration-200`}
        onClick={() => dispatch(hideNotSignedInPopup())}
      ></div>
    </>
  );
}
