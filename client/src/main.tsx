import "./polyfills";
import { ThemeProvider } from "@mui/material/styles";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SocketProvider } from "./SocketContext";

import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </ThemeProvider>
);
