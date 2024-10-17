import { createContext, ReactNode, useEffect, useState } from "react";
import { useOptionalUser, UserType } from "~/root";

interface UserContextProps {
  user: UserType;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const optionalUser = useOptionalUser();
  const [user, setUser] = useState<UserType>(null);

  useEffect(() => {
    setUser(optionalUser as UserType);
  }, [optionalUser]);
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
