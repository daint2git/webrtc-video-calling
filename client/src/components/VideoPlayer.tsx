import { Grid, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect } from "react";
import { SocketContext } from "../SocketContext";

const Div = styled("div")``;
const Video = styled("video")``;

const VideoPlayer = () => {
  const context = useContext(SocketContext);

  if (!context) {
    return null;
  }

  const {
    name,
    callAccepted,
    myVideoRef,
    peerVideoRef,
    callEnded,
    stream,
    call,
  } = context;

  useEffect(() => {
    if (stream && myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Grid
      container
      sx={(theme) => ({
        justifyContent: "center",
        [theme.breakpoints.down("xs")]: {
          flexDirection: "column",
        },
      })}
    >
      {stream && (
        <>
          {/* my video */}
          <Paper
            sx={{ padding: "10px", border: "2px solid black", margin: "10px" }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {name || "Name"}
              </Typography>
              <Video
                playsInline
                muted
                autoPlay
                sx={(theme) => ({
                  width: "550px",
                  [theme.breakpoints.down("xs")]: {
                    width: "300px",
                  },
                })}
                ref={myVideoRef}
              >
                VideoPlayer
              </Video>
            </Grid>
          </Paper>
        </>
      )}

      {callAccepted && !callEnded && (
        <>
          {/* peer video */}
          <Paper
            sx={{ padding: "10px", border: "2px solid black", margin: "10px" }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {call.name || "Name"}
              </Typography>
              <Video
                playsInline
                autoPlay
                sx={(theme) => ({
                  width: "550px",
                  [theme.breakpoints.down("xs")]: {
                    width: "300px",
                  },
                })}
                ref={peerVideoRef}
              >
                VideoPlayer
              </Video>
            </Grid>
          </Paper>
        </>
      )}
    </Grid>
  );
};

export default VideoPlayer;
