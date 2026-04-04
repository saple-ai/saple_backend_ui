import { useState } from "react";
import { IconButton } from "@mui/material";
import { Mic as MicrophoneIcon, Stop as StopIcon } from "@mui/icons-material";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";

const API = import.meta.env.VITE_MODEL_URL;

interface VoicePageProps {
  tenantId: string | number;
  botId: string | number;
  sessionId: string;
  color: string;
}

const VoicePage = ({ tenantId, botId, sessionId, color }: VoicePageProps) => {
  const [token, setToken] = useState(null);
  const [url, setUrl] = useState(undefined);
  const [isRecording, setIsRecording] = useState(false);

  const handleConnect = async () => {
    try {
      // const response = await fetch(`${API}/api/voice/token/`);
      const response = await fetch(
        `${API}/api/voice/token/?sessionid=${sessionId}&botid=${botId}&tenantid=${tenantId}`
      );
      console.log("Response", response);
      const { accessToken, url } = await response.json();
      setToken(accessToken);
      setUrl(url);
      setIsRecording(true);
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  const handleDisconnect = () => {
    setToken(null);
    setUrl(undefined);
    setIsRecording(false);
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        background: "#FFFFFF",
        overflow: "hidden",
        zIndex: "100",
      }}
    >
      <div style={{ position: "relative" }}>
        {token === null ? (
          <IconButton
            className={`recordButton ${isRecording ? "recording" : ""}`}
            onClick={handleConnect}
            disabled={isRecording}
            style={{ backgroundColor: `${color}` }}
          >
            <MicrophoneIcon />
          </IconButton>
        ) : (
          <div
            className="audioRecordingWrapper"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <div
              className="audioControls"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div
                className="recordingStatus"
                style={{
                  fontSize: "1.2rem",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                {isRecording
                  ? "I'm listening..."
                  : "Click the microphone to start"}
              </div>

              <div
                className="controlButtons"
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  className={`recordButton ${isRecording ? "recording" : ""}`}
                  onClick={handleConnect}
                  style={{ backgroundColor: `${{ color }}` }}
                  disabled={isRecording}
                >
                  <MicrophoneIcon />
                </IconButton>

                {isRecording && (
                  <IconButton className="stopButton" onClick={handleDisconnect}>
                    <StopIcon />
                  </IconButton>
                )}

                <LiveKitRoom
                  audio={true}
                  token={token}
                  serverUrl={url}
                  connectOptions={{ autoSubscribe: true }}
                >
                  <RoomAudioRenderer />

                  {/* Metadata management component */}
                  {/* {connected && <MetadataManager />} */}
                </LiveKitRoom>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default VoicePage;
