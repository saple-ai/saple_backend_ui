import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Grid } from '@mui/material';

export default function GroupSizesColors(props:{setlineChartDate:any}) {
  const { setlineChartDate } = props;

  const handleClick = (key:number) => {
    setlineChartDate(key)
  };

  const buttons = [
    <Button key="7" onClick={() => handleClick(7)}>7 Days</Button>,
    <Button key="15" onClick={() => handleClick(15)}>15 Days</Button>,
    <Button key="30" onClick={() => handleClick(30)}>30 Days</Button>,
  ];

  return (
    <Grid container alignItems={"center"} justifyContent="space-between" sx={{ pb: 2 }}>
      {/* <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: '600' }}>Title</Typography> */}
      <ButtonGroup size="small" aria-label="Small button group">
        {buttons}
      </ButtonGroup>
    </Grid>
  );
}
