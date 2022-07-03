import { Typography, AppBar } from "@mui/material";
import { styled } from "@mui/material/styles";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";

const Div = styled("div")``;

function App() {
  return (
    <Div
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",

        [theme.breakpoints.down("xs")]: {
          width: "90%",
        },
      })}
    >
      <AppBar
        position="static"
        color="inherit"
        sx={{
          borderRadius: 15,
          margin: "30px 100px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "600px !important",
          border: "2px solid black",
        }}
      >
        <Typography variant="h2" align="center">
          WebRTC Chat App
        </Typography>
      </AppBar>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </Div>
  );
}

export default App;
