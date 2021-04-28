import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import ErrorboundaryBox from "./component/errorboundary";
import LoaderBox from "./component/loader";

import "./App.css";

import { fetchUserData } from "./store/datastore";

const ChatPage = lazy(() => import("./component/chat"));

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);
  return (
    <div className="bg-light">
      <ErrorboundaryBox>
        <Suspense fallback={<LoaderBox />}>
          <ChatPage />
        </Suspense>
      </ErrorboundaryBox>
    </div>
  );
}

export default App;
