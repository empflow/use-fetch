"use client";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import useFetch from "@/hooks/useFetch";
import {
  hideNotSignedInPopup,
  showNotSignedInPopup,
  toggleNotSignedInPopupOpen,
} from "@/redux/slices/auth";
import NotSignedInPopup from "../components/NotSignedInPopup";

export default function Dashboard() {
  const {
    data: notesData,
    err: notesErr,
    fetch: notesFetch,
    loading: notesLoading,
  } = useFetch({
    url: "/notes",
    method: "get",
    opts: { withAuth: false, fetchImmediately: false },
  });
  const {
    data: tagsData,
    err: tagsErr,
    fetch: tagsFetch,
    loading: tagsLoading,
  } = useFetch({
    url: "/tags",
    method: "get",
    opts: { withAuth: false, fetchImmediately: false },
  });

  return (
    <>
      <NotSignedInPopup />
      <h1>dashboard</h1>

      <div className="flex flex-col gap-5">
        <div>
          <h2>Notes{notesLoading && ": loading..."}</h2>
          <div>data: {JSON.stringify(notesData)}</div>
          <div>error: {JSON.stringify(notesErr)}</div>
          <div>
            <button onClick={notesFetch}>fetch</button>
          </div>
        </div>

        <div>
          <h2>Tags{tagsLoading && ": loading..."}</h2>
          <div>data: {JSON.stringify(tagsData)}</div>
          <div>error: {JSON.stringify(tagsErr)}</div>
          <div>
            <button onClick={tagsFetch}>fetch</button>
          </div>
        </div>
      </div>
    </>
  );
}
