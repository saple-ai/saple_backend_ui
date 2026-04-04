import { ComponentType } from "react";
import { styled } from '@mui/material/styles';
import Grid from "@mui/material/Grid";
import Watermark from '../../container/watermark/index';

import Styles from "./style";

interface PublicLayoutComponentProps {
  component: ComponentType<any>;
  className?: string;
  [key: string]: any;
}

function PublicLayoutComponent({ component: Component, className, ...props }: PublicLayoutComponentProps) {
  return (
    <Grid container className={className}>
      <Component {...props} />
      <Watermark buildDate={import.meta.env.VITE_BUILD_DATE as string} />
    </Grid>
  );
}

export const PublicLayout = styled(PublicLayoutComponent)(Styles);
