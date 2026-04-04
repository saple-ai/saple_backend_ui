// Importing components from Material-UI
import { IconButton, Popover, Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

// Importing components
import HistoryItem from "./components/historyItem";
import Header from "./components/header";

// Importing styles
import style from "./style";

// Importing SVG icons
import { ShareIcon, EditIcon, DeleteIcon } from "../../assets/svg";

interface HistoryBarProps {
  className?: string;
  sidebarPopoverId?: string;
  sidebarPopoverOpen: boolean;
  sidebarPopoverAnchorEl?: any;
  handleSidebarPopoverClose?: () => void;
  sessionUUIDsWithMessages?: any;
  handleSessionClick: (session_uuid: string) => void;
}

// Importing props
const HistoryBar = ({
  className,
  sidebarPopoverId,
  sidebarPopoverOpen,
  sidebarPopoverAnchorEl,
  handleSidebarPopoverClose,
  sessionUUIDsWithMessages,
  handleSessionClick,
}: HistoryBarProps) => {
  return (
    <Grid className={`${className} sideBarRoot`}>
      {/* Header component */}
      <Header />

      {/* Subheader containing additional information */}
      <Grid className={`historySubheader`}>
        <Typography variant="body2" color="textSecondary">
          {sessionUUIDsWithMessages.length}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Recent in 30 days
        </Typography>
      </Grid>

      {/* Container for the list of history items */}
      <Grid className={`historyListing hide-scrollbar`}>
        {/* HistoryItem component representing an individual history entry */}
        <HistoryItem
          handleSessionClick={handleSessionClick}
          sessionUUIDsWithMessages={sessionUUIDsWithMessages}
        />

        {/* Popover for additional options when clicking on a history item */}
        <Popover
          id={sidebarPopoverId}
          open={sidebarPopoverOpen}
          anchorEl={sidebarPopoverAnchorEl}
          onClose={handleSidebarPopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",

            horizontal: "right",
          }}
          className={className}
        >
          {/* Container for additional options in the popover */}
          <Grid className={`historyPopperContainer`}>
            {/* Share option */}
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: "28px" }}>
                <IconButton sx={{ p: 0 }}>
                  <ShareIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2">Share</Typography>}
              />
            </ListItemButton>

            {/* Rename option */}
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: "28px" }}>
                <IconButton sx={{ p: 0 }}>
                  <EditIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2">Rename</Typography>}
              />
            </ListItemButton>

            {/* Delete option */}
            <ListItemButton>
              <ListItemIcon sx={{ minWidth: "28px" }}>
                <IconButton sx={{ p: 0 }}>
                  <DeleteIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2">Delete</Typography>}
              />
            </ListItemButton>
          </Grid>
        </Popover>
      </Grid>
    </Grid>
  );
};

export default styled(HistoryBar)(style);
