import { useContext } from "react";
import { SocketContext } from "../SocketContext";
import { Button } from "@mui/material";

const Notifications = () => {
  const context = useContext(SocketContext);

  if (!context) return null;

  const { answerCall, call, callAccepted } = context;

  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>{call.name} is calling</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;
