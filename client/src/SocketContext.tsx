import {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
  MutableRefObject,
} from "react";
import { io } from "socket.io-client";
import Peer, { SimplePeer } from "simple-peer";

type Call = {
  isReceivedCall: boolean;
  signal: any;
  from: string;
  name: string;
};

const SocketContext = createContext<
  | {
      call: Call;
      callAccepted: boolean;
      myVideoRef: MutableRefObject<HTMLVideoElement | null>;
      peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
      stream: MediaStream | null;
      name: string;
      setName: Dispatch<SetStateAction<string>>;
      callEnded: boolean;
      me: string | null;
      callUser: (id: string) => void;
      answerCall: () => void;
      leaveCall: () => void;
    }
  | undefined
>(undefined);
const socket = io("http://localhost:3001");

type Props = {
  children: ReactNode;
};

const SocketProvider = ({ children }: Props) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const [me, setMe] = useState<string | null>(null);
  const [call, setCall] = useState<Call>({
    isReceivedCall: false,
    signal: null,
    from: "",
    name: "",
  });
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const connectionRef = useRef<SimplePeer["prototype"] | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
    })();

    socket.on("me", (id: string) => setMe(id));

    socket.on(
      "call-user",
      ({
        signal,
        from,
        name: callerName,
      }: {
        signal: string;
        from: string;
        name: string;
      }) => {
        setCall({
          isReceivedCall: true,
          signal,
          from,
          name: callerName,
        });
      }
    );
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    if (stream) {
      const peer = new Peer({ initiator: false, trickle: false, stream });

      peer.on("signal", (data) => {
        socket.emit("answer-call", { signal: data, to: call.from });
      });

      peer.on("stream", (currentStream) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = currentStream;
        }
      });

      peer.signal(call.signal);

      connectionRef.current = peer;
    }
  };

  const callUser = (id: string) => {
    if (stream) {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (data) => {
        socket.emit("call-user", {
          userToCall: id,
          signalData: data,
          from: me,
          name,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log("vao", currentStream);

        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = currentStream;
        }
      });

      socket.on("call-accepted", (signal) => {
        setCallAccepted(true);

        peer.signal(signal);
      });

      connectionRef.current = peer;
    }
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current?.destroy();

    window.location.reload();
  };

  const value = {
    call,
    callAccepted,
    myVideoRef,
    peerVideoRef,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    answerCall,
    leaveCall,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
