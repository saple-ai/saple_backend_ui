import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import style from './style';

const Watermark = (props:{className?: string, buildDate: string}) => {
  const { className, buildDate } = props;

  return (
    <Grid className={className} sx={{ textAlign: 'right' }}>
      <span className='watermark'>Version : 0.1.0 {buildDate}</span>
    </Grid>
  );
}

export default styled(Watermark)(style);
