import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

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
    <ButtonGroup size="small" aria-label="Small button group">
      {buttons}
    </ButtonGroup>
  );
}
