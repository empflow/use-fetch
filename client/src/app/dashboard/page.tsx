"use client";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import useFetch from "@/hooks/useFetch";
import {
  changeByAmount,
  decrement,
  increment,
  setChangeByAmount,
} from "@/redux/slices/counter";

export default function Dashboard() {
  const {
    data: notesData,
    err: notesErr,
    fetch: notesFetch,
    loading: notesLoading,
  } = useFetch({ url: "/notes", method: "get" });
  const {
    data: tagsData,
    err: tagsErr,
    fetch: tagsFetch,
    loading: tagsLoading,
  } = useFetch({ url: "/tags", method: "get" });
  const counter = useAppSelector((state) => state.counter);
  const dispatch = useAppDispatch();

  return (
    <>
      <h1>dashboard</h1>

      <div className="mt-10 mb-10">
        <h2>Count: {counter.value}</h2>
        <div className="flex gap-4">
          <button onClick={() => dispatch(increment())}>Increment</button>
          <button onClick={() => dispatch(decrement())}>Decrement</button>
          <input
            type="number"
            value={counter.changeByAmount}
            onChange={(e) => dispatch(setChangeByAmount(e.target.value))}
          />
          <button onClick={() => dispatch(changeByAmount())}>
            Change count by {counter.changeByAmount}
          </button>
        </div>
      </div>

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
            <button onClick={notesFetch}>fetch</button>
          </div>
        </div>
      </div>
    </>
  );
}
