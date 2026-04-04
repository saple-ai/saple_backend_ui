// Importing components from Material-UI
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Importing styles
import style from "./style";

// Importing props
const Header = ({ className }: { className?: string }) => {
  return (
    <div>
      <Grid className={`${className} sidebarContainer`}>
        {/* Container for the sidebar */}
        <Grid className={`sidebar`}>
          {/* Heading for the history sidebar */}
          <Typography variant="h3">History</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default styled(Header)(style);
