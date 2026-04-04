import { ComponentType } from "react";
import { Box } from "@mui/material";
import Sidebar from "../../container/sidebar/index";
import Watermark from '../../container/watermark/index';

interface PrivateLayoutComponentProps {
    component: ComponentType<any>;
    [key: string]: any;
}

export function PrivateLayout({ component: Component, ...props }: PrivateLayoutComponentProps) {
    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#ACE1AF', position: 'relative' }}>
            {/* Sidebar floats as an absolute overlay on the left edge */}
            <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', zIndex: 200 }}>
                <Sidebar />
            </Box>

            {/* Main content — full width, left margin matches sidebar collapsed width */}
            <Box
                sx={{
                    flex: 1,
                    ml: '68px',
                    background: '#f8fafc',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    p: 3,
                    position: 'relative',
                }}
            >
                <Component {...props} />
                <Watermark buildDate={import.meta.env.VITE_BUILD_DATE} />
            </Box>
        </Box>
    );
}
