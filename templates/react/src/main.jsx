import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("root element wasn't found");
const root = createRoot(rootEl);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
