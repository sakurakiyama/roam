/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useState, ReactNode } from 'react';
import { UserData } from '../types';

interface UserProviderProps {
  children: ReactNode; // Specify the type for children
}

export const UserContext = createContext<{
  user: UserData | null;
  updateUser: (userData: UserData) => void;
}>({
  user: null,
  updateUser: () => {},
});

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);

  // Function to set the user data
  const updateUser = (userData: UserData) => {
    setUser(userData);
  };

  // Provide the user and updateUser function to children components
  const contextValue = { user, updateUser };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
