import React, { useState, useMemo } from 'react';
import {
    Grid,
    Table as TableComp,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Popover,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { MenuIcon, DeleteIcon } from '../../assets/svg/index';
import style from './style';

interface TableComponentProps {
    className?: string;
    headers: string[];
    data: Record<string, any>[];
    handleDelete: (userId: number) => void;
    actions: string[];
    tabletitleType?: boolean;
    searchRows: number[];
}

function TableComponent({
    className,
    headers,
    data,
    handleDelete,
    actions,
    tabletitleType = true,
    searchRows
}: TableComponentProps) {
    const [sidebarPopoverAnchorEl, setSidebarPopoverAnchorEl] = useState<HTMLElement | null>(null);
    const [idpass, setIdpass] = useState<string | number>('');
    const [sortedColumn, setSortedColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchQueries, setSearchQueries] = useState<string[]>(headers.map(() => ''));

    const handleSidebarPopoverClose = (): void => setSidebarPopoverAnchorEl(null);
    const handleSidebarPopoverOpen = (event: React.MouseEvent<HTMLElement>): void => setSidebarPopoverAnchorEl(event.currentTarget);

    const handleSort = (columnName: string): void => {
        if (sortedColumn === columnName) {
            setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortedColumn(columnName);
            setSortDirection('asc');
        }
    };

    const handleSearchChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const newSearchQueries = [...searchQueries];
        newSearchQueries[index] = event.target.value;
        setSearchQueries(newSearchQueries);
    };

    const sortedData = useMemo(() => {
        if (!sortedColumn) return data;
        return [...data].sort((a, b) => {
            const aValue = a[sortedColumn];
            const bValue = b[sortedColumn];
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });
    }, [data, sortedColumn, sortDirection]);

    const filteredData = useMemo(() => {
        return sortedData.filter(item => {
            return searchQueries.every((query, index) => {
                const value = item[Object.keys(item)[index]];
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(query.toLowerCase());
                }
                return true;
            });
        });
    }, [sortedData, searchQueries]);

    // const handleEditAndClosePopover = (itemId: string | number): void => {
    //     handleEdit(itemId);
    //     handleSidebarPopoverClose();
    // };

    const handleDeleteAndClosePopover = (itemId: number): void => {
        handleDelete(itemId);
        handleSidebarPopoverClose();
    };

    const popoverContent = (
        <Grid className={`historyPopperContainer`}>
            {/* {actions.includes('EDIT') && (
                <ListItemButton onClick={() => handleEditAndClosePopover(idpass)} className={` editButton`}>
                    <ListItemIcon sx={{ minWidth: '28px' }}>
                        <IconButton sx={{ p: 0 }}>
                            <EditIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">Edit</Typography>} />
                </ListItemButton>
            )} */}
            {actions.includes('DELETE') && (
                <ListItemButton onClick={() => handleDeleteAndClosePopover(Number(idpass))} className={` deleteButton`}>
                    <ListItemIcon sx={{ minWidth: '28px' }}>
                        <IconButton sx={{ p: 0 }}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText primary={<Typography variant="body2">Delete</Typography>} />
                </ListItemButton>
            )}
        </Grid>
    );

    return (
        <Grid container className={className}>
            <TableContainer sx={{ maxHeight: '70vh' }} className={`${tabletitleType ? "tileTable hide-scrollbar" : 'stripedTable hide-scrollbar'}`}>
                <TableComp stickyHeader aria-label="sticky table">
                    <TableHead className='tableHeader'>
                        <TableRow>
                            {headers.map((item, index) => {
                                if (item !== 'id') {
                                    return (
                                        <TableCell key={index} className='cellContent'>
                                            {/* @ts-ignore */}
                                            <Typography variant='body1' className='fw-600' noWrap onClick={() => handleSort(data && data.length > 0 && Object.keys(data[0])[index])}>
                                                {item}
                                                {sortedColumn === (data && data.length > 0 && Object.keys(data[0])[index]) && searchRows.includes(index) &&(
                                                    <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                                                )}
                                            </Typography>
                                            <div >
                                                {searchRows && searchRows.includes(index) && (
                                                    <TextField
                                                        size="small"
                                                        variant="outlined"
                                                        margin="dense"
                                                        value={searchQueries[index]}
                                                        onChange={(event) => handleSearchChange(index, event)}
                                                        placeholder={`Search ${item}`}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </TableRow>
                    </TableHead>

                    <TableBody className='tableBody'>
                        {filteredData.map((item, index) => (
                            <TableRow key={index}>
                                {Object.entries(item).map(([key, value], index) => (
                                    key !== 'id' &&
                                    <TableCell key={index} className='cellContent'>
                                        {value}
                                    </TableCell>
                                ))}
                                <TableCell className='cellContent'>
                                    <Grid container justifyContent={"center"}>
                                        <IconButton
                                            sx={{ width: '30px', height: '30px' }}
                                            onClick={(event) => {
                                                setIdpass(item.id);
                                                handleSidebarPopoverOpen(event);
                                            }}
                                            className={`historyMore`}
                                        >
                                            <MenuIcon />
                                        </IconButton>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </TableComp>
            </TableContainer>
            <Popover
                open={Boolean(sidebarPopoverAnchorEl)}
                anchorEl={sidebarPopoverAnchorEl}
                onClose={handleSidebarPopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                className={className}
            >
                {popoverContent}
            </Popover>
        </Grid>
    );
}

export const Table = styled(TableComponent)(style);