import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/msalConfig";
import { AccountProvider } from "./auth/AccountContext";
import App from "./App";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <AccountProvider>
        <App />
      </AccountProvider>
    </MsalProvider>
  </React.StrictMode>
);
