// Importing components from Material-UI
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Importing styles
import style from "./style";

// Importing SVG icon for menu

interface HistoryItemProps {
  className?: string;
  sessionUUIDsWithMessages: any;
  handleSessionClick: (session_uuid: string) => void;
}

// Importing props
const HistoryItem = ({
  className,
  sessionUUIDsWithMessages,
  handleSessionClick,
}: HistoryItemProps) => {
  return (
    <>
      {sessionUUIDsWithMessages
        .sort((a: any, b: any) => {
          // Convert formattedDate and formattedTime to Date objects for comparison
          const dateA = new Date(`${a.formattedDate} ${a.formattedTime}`);
          const dateB = new Date(`${b.formattedDate} ${b.formattedTime}`);
          // Sort in descending order
          // @ts-ignore
          return dateB - dateA;
        })
        .map((session_uuid: any, index: any) => (
          <Grid
            className={`${className} hide-scrollbar historyItem`}
            key={index}
            onClick={() => handleSessionClick(session_uuid.session_uuid)}
          >
            {/* Displaying the text of the history item */}
            <Typography variant="body2" sx={{ pr: 1 }}>
              {session_uuid.formattedDate} {session_uuid.formattedTime}
            </Typography>
          </Grid>
        ))}
    </>
  );
};

export default styled(HistoryItem)(style);
