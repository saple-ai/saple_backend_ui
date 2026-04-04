import { useState, ComponentType } from "react";
import Grid from "@mui/material/Grid";
import { styled } from '@mui/material/styles';
import { IconButton } from "@mui/material";
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

import Styles from "./style";
import Sidebar from "../../container/sidebar/index";
import Watermark from '../../container/watermark/index';

interface PrivateLayoutComponentProps {
    component: ComponentType<any>;
    className?: string;
    [key: string]: any;
}

function PrivateLayoutComponent({ component: Component, className, ...props }: PrivateLayoutComponentProps) {
    const [openDrawer, setOpenDrawer] = useState<boolean>(true);

    const handleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <Grid container className={className}>
            <IconButton onClick={handleDrawer} className="drawericon" sx={{
                left: openDrawer ? "60px" : '180px',
                '& .MuiPaper-root': {
                    left: openDrawer ? "60px" : '180px'
                }
            }}>
                <KeyboardTabIcon />
            </IconButton>
            <Grid item xs={12}>
                {/* Empty grid item */}
            </Grid>
            <Grid item xs={12} className="wrapper" sx={{ height: '100%' }}>
                <Grid container wrap="nowrap" sx={{ height: '100%' }} className="fullcontainer">
                    <Grid item className="sidebarRoot" sx={{
                        width: openDrawer ? "80px" : '200px',
                        '& .MuiPaper-root': {
                            width: openDrawer ? "80px" : '200px'
                        }
                    }}>
                        <Sidebar />
                    </Grid>
                    <Grid item className="mainPanel">
                        <Component {...props} />
                        <Watermark buildDate={import.meta.env.VITE_BUILD_DATE} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export const PrivateLayout = styled(PrivateLayoutComponent)(Styles);
