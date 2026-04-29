import { createContext, useContext, useState, ReactNode } from "react";

export type Provider = "microsoft" | "google";

export interface ConnectedAccount {
  provider: Provider;
  accountId: string;
  displayName: string;
  email: string;
  accessToken: string;
}

interface AccountContextValue {
  accounts: ConnectedAccount[];
  addAccount: (account: ConnectedAccount) => void;
  removeAccount: (accountId: string) => void;
  getToken: (provider: Provider) => string | null;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);

  function addAccount(account: ConnectedAccount) {
    setAccounts((prev) => {
      const filtered = prev.filter((a) => a.accountId !== account.accountId);
      return [...filtered, account];
    });
  }

  function removeAccount(accountId: string) {
    setAccounts((prev) => prev.filter((a) => a.accountId !== accountId));
  }

  function getToken(provider: Provider): string | null {
    const account = accounts.find((a) => a.provider === provider);
    return account?.accessToken ?? null;
  }

  return (
    <AccountContext.Provider value={{ accounts, addAccount, removeAccount, getToken }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccounts must be used within AccountProvider");
  return ctx;
}
