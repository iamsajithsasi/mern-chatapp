import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./datastore";

export default configureStore({
  reducer: {
    chatApp: userSlice,
  },
});
