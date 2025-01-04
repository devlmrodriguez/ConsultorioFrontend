// Setup axios early to avoid duplication and concurrent errors
import "./utils/axios-setup";
// Setup es-zod early
import "./utils/es-zod";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

// Render the app
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
