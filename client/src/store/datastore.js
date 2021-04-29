import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserData = createAsyncThunk(
  "chatapp/fetchUserData",
  async () => {
    return fetch("api/user_list").then((res) => res.json());
  }
);

export const fetchUserChatData = createAsyncThunk(
  "chatapp/fetchUserChatData",
  async (userid) => {
    return fetch(`api/message_list_by_user/${userid}`).then((res) =>
      res.json()
    );
  }
);

export const userSlice = createSlice({
  name: "chatapp",
  initialState: {
    user: [],
    chat: [],
    status: "init",
    chatStatus: "init",
  },
  reducers: {
    updateUserData: (state, action) => {
      state.data = action.payload.data;
    },
  },
  extraReducers: {
    [fetchUserData.fulfilled]: (state, action) => {
      state.user = action.payload.data;
      state.status = "success";
    },
    [fetchUserData.rejected]: (state, action) => {
      state.user = [];
      state.status = "failed";
    },
    [fetchUserData.pending]: (state, action) => {
      state.user = [];
      state.status = "pending";
    },
    [fetchUserChatData.fulfilled]: (state, action) => {
      state.chat = action.payload.data.reverse();
      state.chatStatus = "success";
    },
    [fetchUserChatData.rejected]: (state, action) => {
      state.chat = [];
      state.chatStatus = "failed";
    },
    [fetchUserChatData.pending]: (state, action) => {
      state.chat = [];
      state.chatStatus = "pending";
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateUserData } = userSlice.actions;

export default userSlice.reducer;
