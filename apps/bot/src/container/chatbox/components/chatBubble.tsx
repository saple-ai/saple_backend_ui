// import PropTypes from 'prop-types';

// Importing components from Material-UI
import { Grid, Typography, Chip, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import style from "./style.tsx";
import ReactMarkdown from 'react-markdown';

const CHIPS_RE = /\[\[CHIPS:([^\]]+)\]\]/;
const BUY_RE = /\[\[BUY:([^|]+)\|([^\]]+)\]\]/;

function parseChips(text: string): { displayText: string; chips: string[] } {
  const match = text.match(CHIPS_RE);
  if (!match) return { displayText: text, chips: [] };
  const chips = match[1].split("|").map(c => c.trim()).filter(Boolean);
  const displayText = text.replace(CHIPS_RE, "").trimEnd();
  return { displayText, chips };
}

function parseBuyTag(text: string): { displayText: string; productId: string; productName: string } {
  const match = text.match(BUY_RE);
  if (!match) return { displayText: text, productId: "", productName: "" };
  return {
    displayText: text.replace(BUY_RE, "").trimEnd(),
    productId: match[1].trim(),
    productName: match[2].trim(),
  };
}

function sendBuyMessage(type: "saple_add_to_cart" | "saple_buy_now", productId: string, productName: string) {
  window.parent.postMessage({ type, productId, productName }, "*");
}

interface Message {
  text: string | React.ReactNode;
  sender: "user" | "bot";
}
type ChatBubbleProps = {
  className?: string;
  message: Message;
  color?: string;
  font: string;
  fontStyle: string;
  fontSize: string;
  onChipClick?: (chip: string) => void;
};
// Importing props
const ChatBubble = ({ className, message, font, fontStyle, fontSize, onChipClick }: ChatBubbleProps) => {
  const rawText = typeof message.text === 'string' ? message.text : null;
  const { displayText: afterChips, chips } = rawText ? parseChips(rawText) : { displayText: rawText, chips: [] };
  const { displayText, productId, productName } = afterChips
    ? parseBuyTag(afterChips)
    : { displayText: afterChips, productId: "", productName: "" };
  const hasBuyActions = Boolean(productId);
  const isCalendlyWidget = typeof displayText === 'string' && displayText.includes('calendly');

  const getHtmlContent = (html: string) => {
    return {
      __html: html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    };
  };

  useEffect(() => {
    if (isCalendlyWidget && typeof message.text === 'string') {
      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      let match;
      while ((match = scriptRegex.exec(message.text))) {
        const script = document.createElement('script');
        if (match[1]) {
          script.textContent = match[1];
        }
        const srcMatch = match[0].match(/src="([^"]*)"/);
        if (srcMatch && srcMatch[1]) {
          script.src = srcMatch[1];
        }
        script.async = match[0].includes('async');
        document.body.appendChild(script);
      }
    }
  }, [message, isCalendlyWidget]);

  return (
    <div
      className={`${className} chatMessagesContainer`}
      style={{
        alignItems: message.sender === "user" ? "flex-end" : "start",
      }}
    >
      <Grid
        className={`${message.sender === "user" ? "UserMessage" : "OtherMessage"} chatBubble`}
        style={{
          background: message.sender === "user" ? '#eaeaea' : "#f8f8fa",
          color: message.sender === "user" ? "#000000" : "#000000",
          fontFamily: `${font} !important` || 'Arial, sans-serif',
          fontSize: `${fontSize} !important` || '16px',
          fontStyle: fontStyle?.includes('italic') ? 'italic !important' : 'normal !important',
          fontWeight: fontStyle?.includes('bold') ? 'bold !important' : 'normal !important',
          alignItems: message.sender === "user" ? "flex-end" : "flex-start",
          justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        }}
      >
        {isCalendlyWidget && typeof displayText === 'string' ? (
          <div dangerouslySetInnerHTML={getHtmlContent(displayText)} />
        ) : rawText === null ? (
          // ReactNode content (e.g. loading pulse dots)
          <>{message.text}</>
        ) : (
          <Typography
            variant="body2"
            component="pre"
            className={message.sender === "user" ? "messageQuestion" : "messageAnswer"}
            sx={{
              color: message.sender === "user" ? "#000000" : "#000000",
              fontFamily: `${font} !important` || 'Arial, sans-serif',
              fontSize: `${fontSize} !important` || '16px',
              fontStyle: fontStyle?.includes('italic') ? 'italic !important' : 'normal !important',
              fontWeight: fontStyle?.includes('bold') ? 'bold !important' : 'normal !important',
              overflowWrap: "normal",
              whiteSpace: "normal",
            }}
          >
            <ReactMarkdown>{displayText || (message as any).content || ''}</ReactMarkdown>
          </Typography>
        )}
        {chips.length > 0 && onChipClick && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {chips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                size="small"
                clickable
                onClick={() => onChipClick(chip)}
                sx={{
                  fontFamily: font || 'Arial, sans-serif',
                  fontSize: "13px",
                  cursor: "pointer",
                  backgroundColor: "#f0eaff",
                  color: "#5b21b6",
                  "&:hover": { backgroundColor: "#ddd6fe" },
                }}
              />
            ))}
          </Box>
        )}
        {hasBuyActions && (
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => sendBuyMessage("saple_add_to_cart", productId, productName)}
              sx={{
                fontFamily: font || 'Arial, sans-serif',
                fontSize: "13px",
                textTransform: "none",
                borderColor: "#5b21b6",
                color: "#5b21b6",
                "&:hover": { borderColor: "#4c1d95", backgroundColor: "#f0eaff" },
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => sendBuyMessage("saple_buy_now", productId, productName)}
              sx={{
                fontFamily: font || 'Arial, sans-serif',
                fontSize: "13px",
                textTransform: "none",
                backgroundColor: "#5b21b6",
                "&:hover": { backgroundColor: "#4c1d95" },
              }}
            >
              Buy Now
            </Button>
          </Box>
        )}
      </Grid>
    </div>
  );
};

export default styled(ChatBubble)(style);
