import React, { useEffect, useRef } from "react";

// Material-UI imports
import {
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Component imports
import Header from "./components/header.tsx";
import ChatBubble from "./components/chatBubble.tsx";

// Style import
import style from "./style.tsx";

// Icon imports
import { RoboIcon, SendIcon } from "../../assets/svg";
import { BotDetailsItem as BotDetail } from "../../utils/types.ts";

// Types and Interfaces
interface PopoverSize {
  width: number;
  height: number;
}

interface Message {
  text: string | React.ReactNode;
  sender: "user" | "bot";
}

interface ChatBoxProps {
  className?: string;
  popoverSize: PopoverSize;
  isMaximized: boolean;
  showContent: boolean;
  handleMaximize: () => void;
  onNewMessageClick: () => void;
  sidebarOpenState?: boolean;
  newMessage: string;
  handleSendMessageIcon: () => void;
  setNewMessage: (message: string) => void;
  messages: Message[];
  sidebarOpen?: boolean;
  botdropDown: string;
  handleBotChange: (event: { target: { value: any } }) => void;
  botDetails: BotDetail[];
  historyselect: boolean;
  bot?: string;
  disableInput: boolean;
  color: string;
  font: string;
  fontStyle: string;
  fontSize: string;
  onChipClick?: (chip: string) => void;
}

// Custom hook for chat scroll
const useChatScroll = (messages: Message[]) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Use `requestAnimationFrame` to ensure smooth scrolling after DOM updates
      requestAnimationFrame(() => {
        ref.current?.scrollTo({
          top: ref.current.scrollHeight,
          behavior: 'smooth',  // Optional: Makes scrolling smooth
        });
      });
    }
  }, [messages]);

  return ref;
};

const ChatBox: React.FC<ChatBoxProps> = ({
  className,
  popoverSize,
  isMaximized,
  showContent,
  handleMaximize,
  onNewMessageClick,
  newMessage,
  handleSendMessageIcon,
  setNewMessage,
  messages,
  botdropDown,
  handleBotChange,
  botDetails,
  historyselect,
  bot,
  sidebarOpen,
  disableInput,
  color,
  font,
  fontStyle,
  fontSize,
  onChipClick,
}) => {
  const ref = useChatScroll(messages);

  return (
    <Grid
      className={className}
      sx={{
        width: "100%",
        height: `${popoverSize.height === 400 ? "calc(100% - 100px)" : "calc(100% - 126px)"}`,
        display: 'flex',          // Crucial for flex children
        flexDirection: 'column',  // Stacks header + chat + input
      }}
    >
      <Header
        isMaximized={isMaximized}
        handleMaximize={handleMaximize}
        onNewMessageClick={onNewMessageClick}
        botdropDown={botdropDown}
        handleBotChange={handleBotChange}
        botDetails={botDetails}
        bot={bot}
        color={color}
      />

      <Grid className="chatWrapper"
        sx={{
          flex: 1,                // Takes remaining space
          display: 'flex',
          flexDirection: 'column',
        }}>
        {showContent ? (
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            // marginTop={14}
            className="howCanHelp"
          >
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <RoboIcon color={color} />
              <Typography
                variant="body1"
                sx={{ mt: 1 }}
                className="dflex aCenter"
              >
                <Grid component="span" sx={{ mr: 1 }}>
                  How can I help you?
                </Grid>
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid className="chatMsgWrapper hide-scrollbar" ref={ref}>
              <Grid className="chatContainer">
                {messages.map((message, index) => (
                  <ChatBubble
                    key={index}
                    message={message}
                    font={font}
                    fontStyle={fontStyle}
                    fontSize={fontSize}
                    onChipClick={onChipClick} />
                ))}
              </Grid>
            </Grid>
          </>
        )}

        {!botdropDown && !historyselect && (
          <Grid
            style={{
              position: "absolute",
              bottom: "63px",
              width: sidebarOpen && isMaximized ? "59%" : "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid>Please select a bot!</Grid>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                marginTop: "5px",
                width: "300px",
              }}
            >
              {botDetails?.map((botDetail, index) => (
                <div
                  style={{
                    padding: "10px",
                    background: "#ffffff",
                    borderRadius: "8px",
                    margin: "0px 5px 10px 0px",
                    cursor: "pointer",
                    border: "1px solid #000",
                    width: "30%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  key={index}
                  onClick={() =>
                    handleBotChange({ target: { value: botDetail.container } })
                  }
                >
                  {botDetail.name.toUpperCase()}
                </div>
              ))}
            </div>
          </Grid>
        )}

        <Grid
          className="chatInputRoot"
          sx={{
            pr: 0,
            pl: 0,
            width: sidebarOpen && isMaximized ? "59%" : "100%",
          }}
        >
          <Grid className="chatInputContainer">
            <TextField
              disabled={disableInput}
              placeholder={disableInput ? 'Loading...' : 'Type your message...'}
              variant="standard"
              fullWidth
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMessage(e.target.value)
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleSendMessageIcon();
                }
              }}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={disableInput}
                      onClick={handleSendMessageIcon}
                      sx={{ p: 0 }}
                      style={{ outline: "none" }}
                    >
                      <SendIcon color={color} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default styled(ChatBox)(style);
