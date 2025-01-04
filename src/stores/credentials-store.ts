import { create, StateCreator } from "zustand";
import { Credentials } from "../models/common/credentials";
import { persist } from "zustand/middleware";

interface CredentialsState {
  credentials: Credentials | null;
  setCredentials: (credentials: Credentials) => void;
  removeCredentials: () => void;
}

const credentialsStoreSlice: StateCreator<CredentialsState> = (set) => ({
  credentials: null,
  setCredentials: (newCredentials) => {
    set({ credentials: newCredentials });
  },
  removeCredentials: () => {
    set({ credentials: null });
  },
});

const persistedCredentialsStore = persist<CredentialsState>(
  credentialsStoreSlice,
  {
    name: "credentials",
  },
);

export const useCredentialsStore = create(persistedCredentialsStore);
