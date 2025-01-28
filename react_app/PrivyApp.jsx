import React, { useEffect } from "react";

import { PrivyProvider, usePrivy } from "@privy-io/react-auth";

const App = (props) => {
  const { ready, authenticated, user, login, logout } = usePrivy();

  useEffect(() => {
    if (props.onReadyChange) {
      props.onReadyChange(ready);
    }
  }, [ready]);

  useEffect(() => {
    if (props.onAuthenticatedChange) {
      props.onAuthenticatedChange(authenticated);
    }
  }, [authenticated]);

  useEffect(() => {
    if (props.onUserChange) {
      props.onUserChange(user);
    }
  }, [user]);

  useEffect(() => {
    if (props.onLoginMethodChange) {
      props.onLoginMethodChange(login);
    }
  }, [login]);

  useEffect(() => {
    if (props.onLogoutMethodChange) {
      props.onLogoutMethodChange(logout);
    }
  }, [logout]);

  return <div />;
};

export default function ({ ["app-id"]: appId, ...props }) {
  return (
    <PrivyProvider
      appId={appId}
      config={{
        // Display email and wallet as login methods
        loginMethodsAndOrder: {
          primary: [
            "email",
            "google",
            "wallet",
            "privy:cm4wxxujb022fyujl7g0thb21",
          ],
        },
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#F59E0B",
          logo: "https://staging.book3.app/apple-touch-icon.png",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App {...props} />
    </PrivyProvider>
  );
}
