// This file was written based on the following article:
// https://dev.to/vikirobles/react-authentication-with-firebase-v9-typescript-and-yup-4025

import React, {
  ReactNode,
  useEffect,
  useState,
  useContext,
  createContext,
} from "react";

import {
  getAuth,
  Auth,
  UserCredential,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { setUserId } from "firebase/analytics";

// export interface AuthProviderProps {
//   children?: React.ReactNode
// }

export interface UserProviderProps {
  children?: React.ReactNode;
}

export interface UserContext {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  username: string | null;
}

export const UserContext = createContext<UserContext>({} as UserContext);

export const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const auth = getAuth();

  useEffect(() => {
    // firebase.google.com/docs/auth/web/manage-users
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUsername(user.displayName);
        setUserId(user.uid);
        setIsAuthenticated(true);
      } else {
        setUsername(null);
        setUserId(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const values = {
    username,
    userId,
    isAuthenticated,
    isLoading,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContext => {
  return useContext(UserContext);
};
