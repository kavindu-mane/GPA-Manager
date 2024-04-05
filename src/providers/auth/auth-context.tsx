/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext } from "react";

const defaultValue = {
  user: {
    id: 0,
    name: "",
    email: "",
    created_at: "",
    updated_at: "",
  },
  setUserValue: (_newValue: any) => {},
};

export const AuthContext = createContext(defaultValue);
export const useAuth = () => useContext(AuthContext);
