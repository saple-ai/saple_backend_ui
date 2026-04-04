import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Material-UI imports
import { IconButton, Popover, Grid, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Mic as MicrophoneIcon, Chat as ChatIcon } from "@mui/icons-material";

// Component imports
import HistoryBar from "./historyBar";
import ChatBox from "./chatbox";
import VoicePage from "./voice/VoicePage";

// Icon imports
import { DrawerIcon, FabCloseIcon, FabIcon } from "../assets/svg/index";

// Utils
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

// Styles
import style from "./style";
import { BotDetailsItem } from "../utils/types";
// ENV
const MODEL = import.meta.env.VITE_MODEL_URL;
const API = (import.meta.env.VITE_API_URL as string).replace(/\/$/, '');

// Types
interface Message {
  text: string | React.ReactNode;
  sender: "user" | "bot";
  content?: string;
}

interface Storage {
  id: number;
  tenant: string;
  blob_storage: string;
  name: string;
}

interface SessionUUID {
  session_uuid: string;
  formattedDate: string;
  formattedTime: string;
}

// interface PopoverSize {
//   width: number;
//   height: number;
// }

interface BotProps {
  className?: string;
}

// Styled components
// const AnimatedText = styled("div")`
//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//       transform: translateY(10px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }
//   animation: fadeIn 0.3s ease-out forwards;
// `;

const Bot: React.FC<BotProps> = ({ className = "" }) => {
  // Ensure local_uuid exists synchronously before any async effects run
  if (!localStorage.getItem("local_uuid")) {
    localStorage.setItem("local_uuid", uuidv4());
  }

  // State
  const [value, setValue] = useState<number>(0);
  const [mainPopoverAnchorEl, setMainPopoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [sidebarPopoverAnchorEl, setSidebarPopoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [popoverSize, setPopoverSize] = useState({ width: 500, height: 500 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [disableInput, setDisableInput] = useState<boolean>(false);
  const [clearChatFlag, setClearChatFlag] = useState<boolean>(false);
  const [sidebarOpenState, setSidebarOpenState] = useState<boolean>(false);
  const [botdropDown, setBotDropDown] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sessionUUIDsWithMessages, setSessionUUIDsWithMessages] = useState<
    SessionUUID[]
  >([]);
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({});
  const [_messagesMap, setMessagesMap] = useState<Record<string, any>>({});
  const [_selectedSession, setSelectedSession] = useState<string | null>(null);
  const [botIcon, setBotIcon] = useState<boolean>(false);
  const [botDetails, setBotDetails] = useState<BotDetailsItem[] | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [storage, setStorage] = useState<Storage>({} as Storage);
  const [containerName, setContainerName] = useState<string>("");
  const [historyselect, setHistorySelect] = useState<boolean>(false);
  const [mediatype, setMediatype] = useState<string>("both");
  const [color, setColor] = useState<string>("");
  const [font, setFont] = useState<string>("");
  const [fontStyle, setFontStyle] = useState<string>("");
  const [fontSize, setFontSize] = useState<string>("");
  const [isInitialMessageCanBeSent, setisInitialMessageCanBeSent] =
    useState<boolean>(false);
  // Router params
  const { id, bot } = useParams<{ id: string; bot: string }>();

  // Listen for identity messages from the parent page.
  // The embedding site calls: window.sapleBot("identify", { customer_id: "user@email.com" })
  // which forwards via postMessage to this iframe.
  useEffect(() => {
    if (!bot) return;
    const handleIdentify = (e: MessageEvent) => {
      if (e.data?.type === "saple:identify") {
        const customerId = e.data.customer_id || e.data.email;
        if (customerId) {
          localStorage.setItem(`customer_email_${bot}`, customerId);
        }
      }
    };
    window.addEventListener("message", handleIdentify);
    // Signal to parent that the iframe is ready to receive identity
    window.parent.postMessage({ type: "saple:ready" }, "*");
    return () => window.removeEventListener("message", handleIdentify);
  }, [bot]);

  const tenantId = botDetails?.[0]?.tenant;
  let sessionId = sessionStorage.getItem("session_uuid");
  // Send Initial Message Request — use cached welcome if available
  // Wait for BOTH isInitialMessageCanBeSent AND botDetails to be ready
  useEffect(() => {
    if (!isInitialMessageCanBeSent || !botDetails || botDetails.length === 0) return;
    const cacheKey = `welcome_${bot}`;
    const isIdentifiedUser = !!localStorage.getItem(`customer_email_${bot}`);
    // Skip cache for identified users so they get a personalised "Welcome back!" greeting
    if (!isIdentifiedUser) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { text, ts } = JSON.parse(cached);
          if (Date.now() - ts < 3600_000) {
            setMessages([{ text, sender: "bot" }]);
            setDisableInput(false);
            setShowContent(false);
            return;
          }
        } catch (_) {}
      }
    }
    handleSendMessage("", true)
      .then(() => { console.log("SENT"); })
      .catch((e) => { console.log(e); });
  }, [isInitialMessageCanBeSent, botDetails]);
  // Update chat history
  const updateChatHistory = (sessionUUID: string, messages: Message[]) => {
    setChatHistory((prevHistory) => ({
      ...prevHistory,
      [sessionUUID]: messages,
    }));
  };

  // Fetch bot details
  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        const response = await axios.get(`${API}/admin/bots/${id}/details/`);
        setBotDetails(response.data);
        const details = response.data;
        if (bot) {
          const botDetail = details?.find((item: any) => item.uuid == bot || item.container == bot);
          setColor(botDetail?.color);
          setFont(botDetail?.font);
          setFontStyle(botDetail?.font_style);
          setFontSize(botDetail?.font_size);
          setMediatype(botDetail?.media_type);
          setValue(botDetail?.media_type === "audio" ? 1 : 0)
        }
        else {
          setColor('#000000');
        }
      } catch (error) {
        console.error("Error fetching bot details:", error);
      }
    };
    fetchBotDetails();
  }, [id]);

  // Handle bot container details
  useEffect(() => {
    const fetchData = async () => {
      if (bot) {
        setBotDropDown(bot);
        try {
          await handleNewMessageClick();
        } catch (error) {
          console.error("Error resetting session:", error);
        }
        try {
          const response = await axios.get(`${API}/admin/containers/${bot}/`);
          const containerDetails = response.data;
          setStorage(containerDetails);
          const name = containerDetails.name;
          setContainerName(name);
        } catch (error) {
          console.error("Error fetching container details:", error);
        }
      }
    };
    fetchData().then(() => {
      setisInitialMessageCanBeSent(true);
    });
  }, [bot]);

  // Clear chat effect
  useEffect(() => {
    if (clearChatFlag) {
      setMessages([]);
      setShowContent(true);
      setClearChatFlag(false);
    }
  }, [clearChatFlag]);

  // Handle sending messages
  const handleSendMessage = async (
    msg: string,
    isInitialMessage: boolean = false
  ) => {
    if (!msg.trim() && !isInitialMessage) return;

    const session_uuid = sessionStorage.getItem("session_uuid");
    setNewMessage("");

    const lastThreeConversations = messages?.map((m) => {
      const messageContent = m.text || m.content;

      return {
        role: m.sender === "user" ? "user" : "assistant",
        content:
          typeof messageContent === "string"
            ? messageContent
            : React.isValidElement(messageContent)
              ? "[component]" // or any fallback string
              : "",
      };
    });


    const userMessage =
      msg !== containerName ? { text: msg, sender: "user" as const } : null;
    const local_uuid = localStorage.getItem("local_uuid");
    const bot_id: number | null = Array.isArray(botDetails)
      ? ((botDetails as BotDetailsItem[]).find(
        (o) => o.container === storage.id
      )?.id ?? null)
      : ((botDetails as unknown as BotDetailsItem)?.id ?? null);

    const postUserMessage = async () => {
      await axios.post(`${API}/uuid-pairs/create-message/`, {
        local_uuid,
        session_uuid,
        content: msg,
        sender: "user",
        container_id: storage.id,
        tenant_id: storage.tenant,
        blob_storage_id: storage.blob_storage,
        bot_id: bot_id,
      });
    };

    if (userMessage && !isInitialMessage) {
      await postUserMessage();
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }

    setShowContent(false);
    setDisableInput(true);

    const loadingMessage: Message = {
      text: (
        <span className="pulse-container">
          <span className="pulse-dot"></span>
          <span className="pulse-dot"></span>
          <span className="pulse-dot"></span>
        </span>
      ),
      sender: "bot",
    };
    setMessages((prevMessages) => [...prevMessages, loadingMessage]);

    try {
      if (!botDetails || !storage.id) return;
      const current_Bot: BotDetailsItem | undefined = botDetails!.find(
        (o) => o.container === storage.id
      );
      const botName: string = current_Bot?.name
        ? current_Bot.name.toString().charAt(0).toUpperCase() +
        current_Bot.name.toString().slice(1)
        : "Bot";
      const botId: any = current_Bot ? current_Bot?.id : '';

      const response = await axios.post(
        MODEL,
        {
          user_query: msg.toLowerCase(),
          history_without_input: lastThreeConversations,
          tenant_id: id,
          blob_storage_id: storage.blob_storage.toString(),
          bot: botName,
          bot_id: botId,
          is_initial_message: isInitialMessage,
          local_uuid: localStorage.getItem("local_uuid") || undefined,
          customer_id: localStorage.getItem(`customer_email_${bot}`) || undefined,
          session_id: sessionStorage.getItem("session_uuid") || undefined,
        },
      );
      setDisableInput(false);

      const responseText = response.data?.data ?? response.data;

      // Store discovered customer email for cross-session memory
      if (response.data?.customer_email) {
        try {
          localStorage.setItem(`customer_email_${bot}`, response.data.customer_email);
        } catch (_) {}
      }

      const finalMessage = generateReply({
        data: { response: { message: responseText } },
      });

      // Replace loading dots with the actual response
      setMessages((prevMessages) => [
        ...prevMessages.filter((m) => m !== loadingMessage),
        finalMessage,
      ]);
      updateChatHistory(session_uuid!, [...messages, finalMessage]);

      // Cache welcome message for instant load on return visits
      if (isInitialMessage && bot) {
        try {
          localStorage.setItem(`welcome_${bot}`, JSON.stringify({ text: responseText, ts: Date.now() }));
        } catch (_) {}
      }
    } catch (error) {
      console.error("Error fetching reply:", error);
      setDisableInput(false);
      // Remove loading dots on error
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message !== loadingMessage)
      );
    }
  };

  // Generate reply
  const generateReply = (result: {
    data: { response: { message: string } };
  }): Message => {
    const session_uuid = sessionStorage.getItem("session_uuid");
    let local_uuid = localStorage.getItem("local_uuid");
    const bot_id: BotDetailsItem | undefined = botDetails!.find(
      (o) => o.container === storage.id
    );

    axios.post(`${API}/uuid-pairs/create-message/`, {
      local_uuid,
      session_uuid,
      content: result.data.response.message,
      sender: "bot",
      container_id: storage.id,
      tenant_id: storage.tenant,
      blob_storage_id: storage.blob_storage,
      bot_id: bot_id?.id || null,
    });

    return { text: result.data.response.message, sender: "bot" as const };
  };

  // Handle send message icon click
  const handleSendMessageIcon = () => {
    handleSendMessage(newMessage);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpenState(!sidebarOpenState);
    setSidebarOpen(!sidebarOpen);
  };

  // Popover handlers
  const handleMainPopoverOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setMainPopoverAnchorEl(event.currentTarget);
    setBotIcon(true);
  };

  const handleMainPopoverClose = () => {
    setMainPopoverAnchorEl(null);
    setBotIcon(false);
  };

  const handleSidebarPopoverClose = () => {
    setSidebarPopoverAnchorEl(null);
  };

  // Popover states
  const sidebarPopoverOpen = Boolean(sidebarPopoverAnchorEl);
  const sidebarPopoverId = sidebarPopoverOpen ? "sidebar-popover" : undefined;

  // Handle bot change
  const handleBotChange = async (event: { target: { value: any } }) => {
    const selectedBot = event.target.value;
    setBotDropDown(selectedBot);
    try {
      await handleNewMessageClick();
      const response = await axios.get(
        `${API}/admin/containers/${selectedBot}/`
      );
      const containerDetails = response.data;
      setStorage(containerDetails);
      const name = containerDetails.name;
      setContainerName(name);
      setPrompt(name);
      setNewMessage(name);
    } catch (error) {
      console.error("Error fetching container details:", error);
    }
  };

  // Handle new message prompt
  useEffect(() => {
    if (newMessage.trim() !== "") {
      handleSendMessage(newMessage, true);
    }
  }, [prompt]);

  // Handle new message click
  const onNewMessageClick = () => {
    handleNewMessageClick();
  };

  // Function to handle maximizing and minimizing the chat window
  const handleMaximize = () => {
    console.log("Maximize button clicked", isMaximized);
    if (isMaximized) {
      setPopoverSize({ width: 500, height: 500 });
    } else {
      setPopoverSize({ width: 1000, height: 800 });
    }
    setIsMaximized(!isMaximized);
  };

  // Handle new message click
  const handleNewMessageClick = async () => {
    setClearChatFlag(true);
    let local_uuid = localStorage.getItem("local_uuid");
    let session_uuid = sessionStorage.getItem("session_uuid");
    const response = await axios.get(
      `${API}/admin/uuid-pairs/?local_uuid=${local_uuid}`
    );
    const data = response.data;
    if (session_uuid) {
      session_uuid = data.session_uuid_obj.session_uuid;
      sessionStorage.setItem("session_uuid", session_uuid!);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainPopoverAnchorEl &&
        !mainPopoverAnchorEl.contains(event.target as Node) &&
        !document
          .querySelector(".MuiPopover-root")
          ?.contains(event.target as Node)
      ) {
        handleMainPopoverClose();
      }
      if (
        sidebarPopoverAnchorEl &&
        !sidebarPopoverAnchorEl.contains(event.target as Node) &&
        !document
          .querySelector(".MuiPopover-root")
          ?.contains(event.target as Node)
      ) {
        handleSidebarPopoverClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mainPopoverAnchorEl, sidebarPopoverAnchorEl]);

  // Calculate paper dimensions
  const paperWidth = !botIcon ? "100px" : !isMaximized ? "600px" : "1000px";
  const paperHeight = !botIcon ? "100px" : !isMaximized ? "500px" : "650px";

  window.parent.postMessage({ width: paperWidth, height: paperHeight }, "*");

  // Fetch UUID pairs
  const fetchUUIDPairs = async () => {
    try {
      let local_uuid = localStorage.getItem("local_uuid");
      let session_uuid = sessionStorage.getItem("session_uuid");

      if (!local_uuid) {
        local_uuid = uuidv4();
        localStorage.setItem("local_uuid", local_uuid);
      }

      const response = await axios.get(
        `${API}/admin/uuid-pairs/?local_uuid=${local_uuid}`
      );
      const data = response.data;

      if (!session_uuid) {
        session_uuid = data.session_uuid_obj.session_uuid;
        sessionStorage.setItem("session_uuid", session_uuid!);
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sessionUUIDsWithMessages = data.uuid_pair.session_uuids
        .filter((session: any) => session.messages.length > 0)
        .filter((session: any) =>
          session.messages.some(
            (message: any) => new Date(message.timestamp) > thirtyDaysAgo
          )
        )
        .map((session: any) => {
          const lastMessage = session.messages[session.messages.length - 1];
          const timestamp = new Date(lastMessage.timestamp);
          const formattedDate = timestamp.toLocaleDateString("en-US");
          const formattedTime = timestamp.toLocaleTimeString("en-US");
          return {
            session_uuid: session.session_uuid,
            formattedDate,
            formattedTime,
          };
        });

      setSessionUUIDsWithMessages(sessionUUIDsWithMessages);

      const messagesMap: Record<string, any> = {};
      data.uuid_pair.session_uuids.forEach((pair: any) => {
        if (pair.messages.length > 0) {
          messagesMap[pair.session_uuid] = pair.messages;
        }
      });
      setMessagesMap(messagesMap);

      if (sessionUUIDsWithMessages.length > 0) {
        sessionUUIDsWithMessages.forEach(
          (sessionUUID: (typeof sessionUUIDsWithMessages)[0]) => {
            updateChatHistory(
              sessionUUID.session_uuid,
              messagesMap[sessionUUID.session_uuid]
            );
          }
        );
      }
    } catch (error) {
      console.error("Error fetching UUID pairs:", error);
    }
  };

  // Fetch UUID pairs on mount
  useEffect(() => {
    fetchUUIDPairs();
  }, []);

  // Handle session click
  const handleSessionClick = (session_uuid: string) => {
    setSelectedSession(session_uuid);
    setMessages(chatHistory[session_uuid] || []);
    setShowContent(false);
    sessionStorage.setItem("session_uuid", session_uuid);
    setHistorySelect(true);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };


  return (
    <div className={`${className} bot`}
      style={{
        fontFamily: `${font} !important` || 'Arial, sans-serif',
        fontSize: `${fontSize} !important` || '16px',
        fontStyle: fontStyle?.includes('italic') ? 'italic !important' : 'normal !important',
        fontWeight: fontStyle?.includes('bold') ? 'bold !important' : 'normal !important'
      }}>
      <IconButton
        onClick={handleMainPopoverOpen}
        sx={{ p: 0 }}
        style={{ outline: "none" }}
      >
        {mainPopoverAnchorEl ? (
          <FabCloseIcon color={color} />
        ) : (
          <FabIcon color={color} />
        )}
      </IconButton>

      <Popover
        open={Boolean(mainPopoverAnchorEl)}
        anchorEl={mainPopoverAnchorEl}
        onClose={handleMainPopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          style: {
            width: "100%",
            height: "calc(100% - 95px)",
            overflow: "hidden",
            top: "0px !important",
          },
        }}
      >
        <Grid
          className={`${className} full`}
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            position: "relative",
            flexDirection: "column",
          }}
        >
          <Grid className="chatBoxToggleWrapper">
            {value === 0 && (
              <div className="chatBoxWrapper">
                {isMaximized && (
                  <IconButton
                    onClick={toggleSidebar}
                    className="drawerIcon"
                    style={{
                      outline: "none",
                      right: sidebarOpen ? "373px" : "-22px",
                    }}
                  >
                    <DrawerIcon />
                  </IconButton>
                )}
                <ChatBox
                  popoverSize={popoverSize}
                  isMaximized={isMaximized}
                  showContent={showContent}
                  disableInput={disableInput}
                  handleMaximize={handleMaximize}
                  onNewMessageClick={onNewMessageClick}
                  sidebarOpen={sidebarOpen}
                  newMessage={newMessage}
                  handleSendMessageIcon={handleSendMessageIcon}
                  setNewMessage={setNewMessage}
                  messages={messages}
                  botdropDown={botdropDown}
                  handleBotChange={handleBotChange}
                  botDetails={botDetails!}
                  historyselect={historyselect}
                  bot={bot}
                  color={color}
                  font={font}
                  fontStyle={fontStyle}
                  fontSize={fontSize}
                  onChipClick={(chip) => handleSendMessage(`Show ${chip.toLowerCase()} products`)}
                />
                <div>
                  {isMaximized && sidebarOpen && (
                    <Grid
                      sx={{
                        width: sidebarOpen ? "39%" : "0%",
                        transition: "all 0.3s",
                      }}
                    >
                      <HistoryBar
                        sidebarPopoverId={sidebarPopoverId}
                        sidebarPopoverOpen={sidebarPopoverOpen}
                        sidebarPopoverAnchorEl={sidebarPopoverAnchorEl}
                        handleSidebarPopoverClose={handleSidebarPopoverClose}
                        sessionUUIDsWithMessages={sessionUUIDsWithMessages}
                        handleSessionClick={handleSessionClick}
                      />
                    </Grid>
                  )}
                </div>
              </div>
            )}

            {value === 1 && (
              <VoicePage
                tenantId={tenantId!}
                botId={botdropDown}
                sessionId={sessionId!}
                color={color}
              />
            )}
          </Grid>

          {mediatype === "both" && (
            <div
              className="tabWrapper"
              style={{
                position: "absolute",
                bottom: 0,
                width: sidebarOpen && isMaximized && value !== 1 ? "59%" : "100%",
              }}
            >
              <div className="tabsWrapper" style={{ background: `${color}` }}>
                <Tabs value={value} onChange={handleTabChange} className="tabs">
                  <Tab
                    className="tab"
                    style={{ background: `${color}` }}
                    label={
                      <ChatIcon sx={{ color: "white", padding: 0, margin: 0 }} />
                    }
                  />
                  <Tab
                    className="tab"
                    style={{ background: `${color}` }}
                    label={
                      <MicrophoneIcon
                        sx={{ color: "white", padding: 0, margin: 0 }}
                      />
                    }
                  />
                </Tabs>
              </div>
            </div>
          )}
        </Grid>
      </Popover>
    </div>
  );
};

export default styled(Bot)(style);
