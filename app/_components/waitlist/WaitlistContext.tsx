"use client";

import { createContext, useContext, useState, useCallback } from "react";

type Role = "brand" | "creator" | null;

interface WaitlistContextValue {
  isOpen: boolean;
  preselectedRole: Role;
  openWaitlist: (role?: Role) => void;
  closeWaitlist: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  isOpen: false,
  preselectedRole: null,
  openWaitlist: () => {},
  closeWaitlist: () => {},
});

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedRole, setPreselectedRole] = useState<Role>(null);

  const openWaitlist = useCallback((role: Role = null) => {
    setPreselectedRole(role);
    setIsOpen(true);
  }, []);

  const closeWaitlist = useCallback(() => {
    setIsOpen(false);
    setPreselectedRole(null);
  }, []);

  return (
    <WaitlistContext.Provider value={{ isOpen, preselectedRole, openWaitlist, closeWaitlist }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  return useContext(WaitlistContext);
}
