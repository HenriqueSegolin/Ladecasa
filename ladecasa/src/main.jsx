import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LaDeCasaSite from "./ladecasasite.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LaDeCasaSite />
  </StrictMode>
);
