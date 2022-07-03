import { ReactNode, useContext, useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import copy from "copy-to-clipboard";
import { Assessment, Phone, PhoneDisabled } from "@mui/icons-material";
import { SocketContext } from "../SocketContext";

type Props = {
  children: ReactNode;
};

const Form = styled("form")``;
const Div = styled("div")``;

const Options = ({ children }: Props) => {
  const context = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  if (!context) return null;

  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    context;

  return (
    <Container
      sx={(theme) => ({
        width: "600px",
        margin: "35px 0",
        padding: 0,
        [theme.breakpoints.down("xs")]: {
          width: "80%",
        },
      })}
    >
      <Paper
        elevation={10}
        sx={{ padding: "10px 20px", border: "2px solid black" }}
      >
        <Form
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            sx={(theme) => ({
              width: "100%",
              [theme.breakpoints.down("xs")]: {
                flexDirection: "column",
              },
            })}
          >
            <Grid item xs={12} md={6} p={5}>
              <Typography variant="h6" gutterBottom>
                Account Info
              </Typography>
              <TextField
                variant="standard"
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <Div sx={{ marginTop: "20px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => copy(me!)}
                  fullWidth
                  startIcon={<Assessment fontSize="large" />}
                >
                  Copy your ID
                </Button>
              </Div>
            </Grid>

            <Grid item xs={12} md={6} p={5}>
              <Typography variant="h6" gutterBottom>
                Make a call
              </Typography>
              <TextField
                variant="standard"
                label="ID to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                fullWidth
              />
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={leaveCall}
                  fullWidth
                  startIcon={<PhoneDisabled fontSize="large" />}
                  sx={{ marginTop: "20px" }}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => callUser(idToCall)}
                  fullWidth
                  startIcon={<Phone fontSize="large" />}
                  sx={{ marginTop: "20px" }}
                >
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </Form>
        {children}
      </Paper>
    </Container>
  );
};

export default Options;
