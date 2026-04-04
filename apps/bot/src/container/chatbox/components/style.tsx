// import { PRIMARY_COLOR } from "../../../constant/colors";

const style = () => ({
  "&.headerRoot": {
    background: "#ffffff",
    width: "100%",
    height: "50px",
    boxShadow: `rgba(149, 157, 165, 0.2) 0px 3px 9px`,
  },
  ".maxHeaderNewMsg": {
    background: "#ffffff",
    width: "40%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  },
  ".maxHeader": {
    background: "#ffffff",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ".resources": {
    height: "30px",
    marginLeft: "10px",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
  ".minimizeIcon": {
    cursor: "pointer",
    padding: "10px",
    marginLeft: "14px",
    zIndex: "99",
    marginRight: "5px",
  },
  ".newMsg": {
    // background: `${PRIMARY_COLOR}`,
    color: "white !important",
    padding: "3px 14px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ".newMsgmin": {
    // background: `${PRIMARY_COLOR}`,
    color: "white !important",
    padding: "7px 14px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ".msgIcon": {
    margin: "0px 6px 0 0",
  },
  ".sidebarContainer": {
    background: "#ffffff",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  },
  ".sidebar": {
    background: "#f7f7f7",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #dcdcdc",
    padding: "0 30px",
  },
  ".Search": {
    position: "relative",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    width: "50%",
    border: "1px solid #D5D5D5",
    paddingRight: "30px",
  },
  ".searchInput": {
    color: "inherit",
    height: "30px",
    "& .MuiInputBase-input": {
      padding: "10px",
      paddingRight: `30px)`,
    },
  },
  ".SearchIconWrapper": {
    right: 0,
    top: 0,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: "5px",
    "& svg": {
      fill: "#777C96",
    },
  },
  "&.smallChatHeader": {
    background: "#FBEBFC",
    height: "30px",
    padding: "0 15px",
    flexShrink: 0,
  },
  // ".MiniChatNewMsg": {
  //   color: `${PRIMARY_COLOR}`,
  //   display: "flex",
  //   alignItems: "center",
  // },
  ".maximizeIcon": {
    cursor: "pointer",
  },
  "&.chatMessagesContainer": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    overflowY: "auto",
  },
  ".chatBubble": {
    padding: "10px 25px",
    borderRadius: "20px",
    display: "flex",
    margin: "4px 0px",
    overflowY: "auto",
  },
});

export default style;
