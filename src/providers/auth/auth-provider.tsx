/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, useState } from "react";
import { AuthContext } from ".";
import { userDataType } from "@/types";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<userDataType>(null as any);

  const setUserValue = (newValue: any) => {
    setUser(newValue);
  };

  const contextData = {
    user: user,
    setUserValue: setUserValue,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider };
