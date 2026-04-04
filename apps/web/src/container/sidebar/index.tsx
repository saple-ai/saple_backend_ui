import React from 'react';
import { Avatar, Collapse, Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dashboard, Users, Manage, Tenant } from '../../assets/svg/index';
import style from './style';
import { Link, useLocation } from 'react-router-dom';
import API from '../../utils/api';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

interface MenuItem {
    id: string;
    icon: React.ReactNode;
    title: string;
    path: string;
    childs?: MenuItem[];
}

function Sidebar({ className }:{className?: string}) {
    const [subMenu, setSubMenu] = React.useState<string | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        API.logout();
        setAnchorEl(null);
    };

    const handleClosePop = () => {
        setAnchorEl(null);
    };

    const menuItems: MenuItem[] = [
        {
            id: 'Dashboard',
            icon: <Dashboard />,
            title: 'Dashboard',
            path: '/dashboard',
        },
        {
            id: 'tenant',
            icon: <Tenant />,
            title: 'Tenant',
            path: '/tenant',
        },
        {
            id: 'Manage',
            icon: <Manage />,
            title: 'Manage',
            path: '/manage',
        },
        {
            id: 'ManageSuper',
            icon: <Manage />,
            title: 'Manage',
            path: '/manageadmin',
        },
        {
            id: 'users',
            icon: <Users />,
            title: 'Users',
            path: '/users',
        },
    ];

    const userRole = sessionStorage.getItem('role');

    const filteredMenuItems = menuItems.filter(item => {
        if (userRole === 'superadmin') {
            return item.id !== 'Manage';
        } else {
            return item.id !== 'tenant' && item.id !== 'ManageSuper';
        }
    });

    const handleMainMenu = (id: string) => {
        if (subMenu !== id) {
            setSubMenu(id);
        } else {
            setSubMenu(null);
        }
    };

    const location = useLocation();

    return (
        <Grid className={className}>
            <Grid container className='sidebarContainer' direction={"column"}>
                <Grid>
                    <Grid sx={{ pt: 7 }}>
                        <Grid item className='menuItems'>
                            <MenuList>
                                {filteredMenuItems.map((item, index) => (
                                    <Grid key={index} className={location.pathname.includes(item.path) ? 'activeLink' : 'inactiveLink'}>
                                        <Link to={item.path} className={location.pathname.includes(item.path) ? 'active' : 'inactive'}>
                                            <MenuItem>
                                                <ListItemIcon className={location.pathname.includes(item.path) ? 'active' : 'inactive'}>
                                                    {item.icon}
                                                </ListItemIcon>
                                                <ListItemText>
                                                    <Typography className={location.pathname.includes(item.path) ? 'activetxt' : 'inactivetxt'}>{item.title}</Typography>
                                                </ListItemText>
                                                {item.childs && item.childs.length > 0 &&
                                                    <IconButton onClick={(event: React.MouseEvent) => { handleMainMenu(item.id); event.preventDefault() }}><ExpandMoreIcon /></IconButton>
                                                }
                                            </MenuItem>
                                        </Link>
                                        {item.childs && (
                                            item.childs.map((childItem, index) => (
                                                <Collapse in={subMenu === item.id} key={index}>
                                                    <Link to={childItem.path} className={location.pathname === childItem.path ? 'active' : 'inactive'}>
                                                        <MenuItem sx={{ pl: 4 }}>
                                                            <ListItemIcon>
                                                                {childItem.icon}
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                <Typography className={location.pathname.includes(item.path) ? 'activetxt' : 'inactivetxt'}>{childItem.title}</Typography>
                                                            </ListItemText>
                                                        </MenuItem>
                                                    </Link>
                                                </Collapse>
                                            ))
                                        )}
                                    </Grid>
                                ))}
                            </MenuList>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className='footer'>
                    <Grid className='profileContainer' alignItems='center'>
                        <IconButton onClick={handleClick}>
                            <Avatar
                                src={undefined}
                                sx={{ width: 30, height: 30 }}
                            >
                                <ExitToAppIcon/>
                            </Avatar>
                        </IconButton>
                    </Grid>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClosePop}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default styled(Sidebar)(style);
