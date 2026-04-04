const style = () => ({
  ".chatWrapper": {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",
    overflowY: "auto",
  },
  ".howCanHelp": {
    width: "100%",
    height: "100%",
  },
  ".chatMsgWrapper": {
    width: "100%",
    height: "100%", // Takes full available height
    overflowY: "auto", // ← MUST be enabled (uncomment this)
    padding: "0 24px",
    display: "flex", // ← Add this
    flexDirection: "column", // ← Add this
  },
  ".chatContainer": {
    width: "100%",
    // overflowY: "auto", ← REMOVE THIS (let parent handle scrolling)
    padding: "0",
    flex: 1, // ← Add this to fill available space
    minHeight: "min-content", // ← Prevents collapse
  },
  ".chatInputContainer": {
    background: "#ffffff",
    height: "50px",
    width: "100%",
    padding: "0px 16px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ".chatInputRoot": {
    // width: '100%',
    bottom: "12px",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: "1px solid #E1E1E1",
  },
});
export default style;
