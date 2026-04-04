// Importing React and necessary dependencies
import React from "react";

// Importing components from Material-UI
import {
  IconButton,
  Grid,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Importing styles
import style from "./style.tsx";

// Importing SVG icons
import {
  WhitePencil,
  MinimizeIcon,
  MaximizeIcon,
} from "../../../assets/svg/index";

interface HeaderProps {
  className?: string;
  isMaximized: boolean;
  handleMaximize: () => void;
  botdropDown: string;
  handleBotChange: (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => void;
  onNewMessageClick: () => void;
  botDetails: any[];
  bot: string | undefined;
  color: string;
}

// Importing props
const Header = ({
  className,
  isMaximized,
  handleMaximize,
  botdropDown,
  handleBotChange,
  onNewMessageClick,
  botDetails,
  bot,
  color,
}: HeaderProps) => {
  return (
    <div>
      {/* // Header for chatbox */}
      <Grid
        container
        justifyContent="space-between"
        className={`${className} headerRoot`}
      >
        <Grid className={`maxHeader`}>
          {/* Dropdown for selecting resources */}
          <Grid style={{ display: "flex" }}>
            {!bot && (
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <Select
                    labelId="bot-select-label"
                    id="bot-select"
                    value={botdropDown}
                    size="small"
                    onChange={handleBotChange} // Just pass the function reference
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    className="resources"
                  >
                    <MenuItem disabled value="">
                      Bot
                    </MenuItem>
                    {botDetails?.map((botDetail, index) => (
                      <MenuItem key={index} value={botDetail.container}>
                        {botDetail.name.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Grid>
          {/* New message and minimize icon */}
          <Grid className={`maxHeaderNewMsg`}>
            <IconButton
              sx={{ p: "0 16px" }}
              onClick={onNewMessageClick}
              style={{ outline: "none" }}
            >
              <Typography
                variant="subtitle1"
                className={isMaximized ? `newMsg` : `newMsgmin`}
                sx={{
                  background: `${color}`,
                }}
              >
                {/* White pencil icon */}
                <WhitePencil />
                {isMaximized ? (
                  <Grid component={"span"} sx={{ pl: 1 }}>
                    New Message
                  </Grid>
                ) : (
                  ""
                )}
              </Typography>
            </IconButton>
            {/* Minimize icon */}
            <IconButton onClick={handleMaximize} className={`minimizeIcon`}>
              {isMaximized ? <MinimizeIcon color={color} /> : <MaximizeIcon color={color} />}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default styled(Header)(style);
