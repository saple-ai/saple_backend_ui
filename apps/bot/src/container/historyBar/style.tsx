const style = () => ({
  "&.sideBarRoot": {
    background: "#f7f7f7",
    width: "397px",
    height: "100%",
    flexShrink: 0,
  },
  ".historySubheader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 30px",
  },
  ".historyListing": {
    height: "445px",
    padding: "0 30px 20px 30px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  ".historyPopperContainer": {
    padding: "8px 0",
    boxShadow: "0px 6px 20px #00000029",
    border: "1px solid #E1E1E1",

    "& .MuiListItemIcon-root": {
      minWidth: "26px",
    },
    "& .MuiButtonBase-root": {
      paddingTop: "4px",
      paddingBottom: "4px",
    },
  },
});
export default style;
