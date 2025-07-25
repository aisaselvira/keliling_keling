"use client"

import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define types for the context
interface AuthDialogContextType {
  isSuccessDialogOpen: boolean;
  isFailedDialogOpen: boolean;
  isUserRegistered: boolean;
  isSignInOpen: boolean;
  setIsSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIsFailedDialogOpen: Dispatch<SetStateAction<boolean>>;
  setIsUserRegistered: Dispatch<SetStateAction<boolean>>;
  setIsSignInOpen: Dispatch<SetStateAction<boolean>>;
}

// Create context with type or null
export const AuthDialogContext = createContext<AuthDialogContextType | null>(null);

// Define the provider props type
interface AuthDialogProviderProps {
  children: ReactNode;
}

// Create a provider component
export const AuthDialogProvider: React.FC<AuthDialogProviderProps> = ({ children }) => {
  const [isSuccessDialogOpen , setIsSuccessDialogOpen] = useState<boolean>(false);
  const [isFailedDialogOpen , setIsFailedDialogOpen] = useState<boolean>(false);
  const [isUserRegistered , setIsUserRegistered] = useState<boolean>(false);
  const [isSignInOpen , setIsSignInOpen] = useState<boolean>(false);

  return (
    <AuthDialogContext.Provider value={{ isSuccessDialogOpen ,isFailedDialogOpen, isSignInOpen, setIsSuccessDialogOpen, setIsFailedDialogOpen,isUserRegistered,setIsUserRegistered, setIsSignInOpen }}>
      {children}
    </AuthDialogContext.Provider>
  );
};

export default AuthDialogContext;