import React from 'react';
import { Dialog, Button, Typography, Grid } from '@mui/material';

interface UserProps {
    ConfirmationOpen: boolean;
    setConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteConfirmed: () => void;
    handleEditConfirmed?: () => void;
    deletion: boolean;
}

function User({
    ConfirmationOpen,
    setConfirmationOpen,
    handleDeleteConfirmed,
    handleEditConfirmed,
    deletion
}: UserProps) {
    const handleClose = () => setConfirmationOpen(false);
    const handleAction = deletion ? handleDeleteConfirmed : handleEditConfirmed;
    const actionText = deletion ? 'Delete' : 'Edit';
    const color = deletion ? 'error' : 'warning';

    return (
        <Dialog
            open={ConfirmationOpen}
            onClose={handleClose}
            aria-labelledby="delete-dialog-title"
            fullWidth
            maxWidth="sm"
        >
            {/* @ts-ignore */}
            <Grid sx={{ p: 4 }} align="center">
                <Typography variant="body1" sx={{ fontWeight: '600', fontSize: '18px' }}>
                    Confirm {actionText}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '16px', pt: 2 }}>
                    Are you sure you want to {actionText}?
                </Typography>
                <Grid sx={{ pt: 3 }}>
                    <Button onClick={handleClose} color="secondary" variant="contained" disableElevation sx={{ mr: 1, textTransform: 'capitalize' }}>Cancel</Button>
                    <Button onClick={handleAction} variant="contained" color={color} sx={{ textTransform: 'capitalize' }} disableElevation>
                        {actionText}
                    </Button>
                </Grid>
            </Grid>

        </Dialog>
    );
}

export default User;
