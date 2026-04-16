import App from "./App.tsx";
import "./sass/index.scss";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { DarkModeProvider } from "./context/DarkModeProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getGoogleClientId } from "./config/env.ts";

const googleClientId = getGoogleClientId();

createRoot(document.getElementById("root")!).render(
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Provider store={store}>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  ) : (
    <BrowserRouter>
      <Provider store={store}>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </Provider>
    </BrowserRouter>
  )
);
