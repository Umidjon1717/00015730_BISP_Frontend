import App from "./App.tsx";
import "./sass/index.scss";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { DarkModeProvider } from "./context/DarkModeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </Provider>
  </BrowserRouter>
);
