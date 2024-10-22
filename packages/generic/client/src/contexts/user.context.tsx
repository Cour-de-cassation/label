import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { urlHandler } from '../utils';

export interface CurrentUser {
  _id?: string;
  email?: string;
  name?: string;
  role?: string;
  passwordTimeValidityStatus?: string;
}
interface UserContextType {
  user: CurrentUser | null;
  loading: boolean;
  onLogout: () => void;
}
const UserContext = createContext<UserContextType | null>(null);

// eslint-disable-next-line react/prop-types
export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userData = await whoami();
      setUser(userData);
      setLoading(false);
    }
    fetchUser();
  }, []);
  const onLogout = () => {
    setUser(null); // Remettre l'utilisateur à null
  };
  return <UserContext.Provider value={{ user, loading, onLogout }}>{children}</UserContext.Provider>;
};

export const useCtxUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useCtxUser must be used within a UserProvider `);
  }
  return context;
};

async function whoami() {
  try {
    const response = await fetch(`${urlHandler.getApiUrl()}/label/api/sso/whoami`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    });

    if (!response.ok) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  } catch (error) {
    console.error('Error fetching authentication status:', error);
    return null;
  }
}
