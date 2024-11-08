import { create, StateCreator } from "zustand";
import { UserCredentials } from "../models/common/user-credentials";
import { persist } from "zustand/middleware";

interface UserCredentialsState {
  userCredentials: UserCredentials | null;
  setCredentials: (userCredentials: UserCredentials) => void;
  removeCredentials: () => void;
}

const userCredentialsStoreSlice: StateCreator<UserCredentialsState> = (
  set,
) => ({
  userCredentials: null,
  setCredentials: (userCredentials) => {
    set({ userCredentials: userCredentials });
  },
  removeCredentials: () => {
    set({ userCredentials: null });
  },
});

const persistedUserCredentialsStore = persist<UserCredentialsState>(
  userCredentialsStoreSlice,
  {
    name: "user-credentials",
  },
);

export const useUserCredentialsStore = create(persistedUserCredentialsStore);
