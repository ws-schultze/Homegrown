import React from "react";
import ReactDOM from "react-dom/client";
import "./css/addressAutoCompleteForm.css";
import "./scss/index.scss";

import "./css/navbar.css";
import "./css/dropdown.css";
import "./css/listing-page.css";
import "./css/listing-form.css";
import "./css/loaders.css";
import "./css/theme-toggle-btn.css";

import reportWebVitals from "./reportWebVitals";
import App from "./App";

import { store } from "./redux/store";
import { fetchListingsAsync } from "./common/commonSlice";
import { Provider } from "react-redux";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "./UserProvider";
import { MapContextProvider } from "./MapProvider";
import { ScreenSizeProvider } from "./ScreenSizeProvider";

// Load all listings before app renders
store.dispatch(fetchListingsAsync());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <UserProvider>
          <MapContextProvider>
            <ScreenSizeProvider>
              <App />
            </ScreenSizeProvider>
          </MapContextProvider>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
