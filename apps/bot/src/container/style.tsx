// import { PRIMARY_COLOR } from "../constant/colors";

const style = () => ({
  "&.bot": {
    position: "fixed",
    right: "34px",
    bottom: "34px",
    boxShadow: "0px 10px 15px #00000033",
    borderRadius: "34px",
  },
  "&.chatBotPopover": {
    "& .MuiPaper-root": {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxShadow: "0px 3px 6px #00000029",
      border: "1px solid #E1E1E1",
    },
  },
  ".chatBoxWrapper": {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  ".displayHide": {
    display: "none",
  },
  ".displayShow": {
    width: "100%",
  },
  ".tabsWrapper": {
    // background: `${PRIMARY_COLOR}`,
    height: "50px",
    overflow: "visible",
    width: "100%",
    position: "relative",
  },
  ".tabs": {
    display: "flex",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    // padding: '0 40px',
    flexDirection: "row",
    width: "100%",
    overflow: "visible",

    "& .MuiTabs-flexContainer": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      overflow: "visible",
      padding: "0 40px",
    },

    "& .Mui-selected": {
      transform: "translateY(-15px)",
      // backgroundColor: `${PRIMARY_COLOR} !important`,
      borderRadius: "50%",
      zIndex: 999,
      transition: "transform 0.3s ease-out",
      border: "5px solid white",
    },

    "& .MuiTabs-scroller": {
      overflow: "visible !important",
    },
  },
  ".tab": {
    minWidth: "unset",
    marginRight: "80px",
    overflow: "visible",
    outline: "none",
    padding: "10px",
    zIndex: 999,
    "& .MuiTab-wrapper": {
      padding: 0,
    },
  },
  ".drawerIcon": {
    padding: "10px",
    borderRadius: "50%",
    background: "white !important",
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 3px 9px",
    width: "45px",
    height: "45px",
    position: "absolute",
    top: "50%",
    border: "1px solid #ECECEC",
  },
  ".chatBoxToggleWrapper": {
    position: "relative",
    width: "100%",
    height: "90%",
  },
  ".pulse-container": {
    display: "flex",
    alignItems: "center",
  },

  ".pulse-dot": {
    width: "5px",
    height: "5px",
    borderRadius: "2.5px",
    backgroundColor: "rgb(35, 141, 233)",
    margin: "7px 3px",
    animation: "flash 1.5s infinite",
  },

  ".pulse-dot:nth-child(2)": {
    animationDelay: "0.2s",
  },

  ".pulse-dot:nth-child(3)": {
    animationDelay: "0.4s",
  },

  "@keyframes flash": {
    "0%": {
      opacity: 0,
    },
    "50%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },

  ".audioRecordingWrapper": {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
  },
  ".audioControls": {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    background: "white",
    borderTop: "1px solid #E1E1E1",
  },
  ".recordingStatus": {
    color: "#666",
    marginBottom: "10px",
    fontSize: "14px",
  },
  ".controlButtons": {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  ".recordButton": {
    width: "60px !important",
    height: "60px !important",
    // backgroundColor: `${PRIMARY_COLOR} !important`,
    color: "white !important",
    transition: "all 0.3s ease",

    "&.recording": {
      backgroundColor: "#ff4444 !important",
      animation: "pulse 1.5s infinite",
    },

    "& .MuiSvgIcon-root": {
      fontSize: "30px",
    },
  },
  ".stopButton": {
    backgroundColor: "#ff4444 !important",
    color: "white !important",
    padding: "17px",

    "& .MuiSvgIcon-root": {
      fontSize: "24px",
    },
  },
  // ".sendButton": {
  //   backgroundColor: `${PRIMARY_COLOR} !important`,
  //   color: "white !important",
  //   padding: "17px",

  //   "& .MuiSvgIcon-root": {
  //     fontSize: "24px",
  //   },
  // },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  ".messageList": {
    flex: 1,
    overflowY: "auto",
    marginBottom: "16px",
  },
  ".message": {
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
  },
});
export default style;
