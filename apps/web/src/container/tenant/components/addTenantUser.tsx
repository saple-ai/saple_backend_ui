import { Grid, Typography, TextField, Button, Dialog, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import style from '../style';

interface AddUserProps {
    open: boolean;
    editMode: boolean;
    className?: string;
    userFormData: any;
    snackbarOpen: boolean;
    snackbarMessage: string;
    handleUserInputChange: (e: any) => void;
    handleAddUser: () => void;
    handleEditUser: () => void;
    handleClose: () => void;
    handleSnackbarClose: () => void;
}

function AddUser(props: AddUserProps) {
    const { open, editMode, className, userFormData, snackbarOpen, snackbarMessage, handleUserInputChange, handleAddUser, handleEditUser, handleClose, handleSnackbarClose } = props;

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={className}
                fullWidth
                maxWidth={"sm"}
            >
                <Grid container sx={{ p: 3 }}>
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant='h2'>{editMode ? "Edit User" : "Add Users"}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Username
                                </Typography>
                                <TextField
                                    name="username"
                                    value={userFormData.username}
                                    onChange={handleUserInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>
                            {!editMode && (
                                <Grid item xs={12} md={12}>
                                    <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                        Password
                                    </Typography>
                                    <TextField
                                        name="password"
                                        value={userFormData.password}
                                        onChange={handleUserInputChange}
                                        size='small'
                                        variant='outlined'
                                        margin='none'
                                        fullWidth
                                        type="password"
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Email
                                </Typography>
                                <TextField
                                    name="email"
                                    value={userFormData.email}
                                    onChange={handleUserInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Phone
                                </Typography>
                                <TextField
                                    name="phone"
                                    value={userFormData.phone}
                                    onChange={handleUserInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                    type="phone"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent={"flex-end"}>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        onClick={editMode ? handleEditUser : handleAddUser}
                                    >
                                        {editMode ? 'Edit' : 'Add'}
                                    </Button>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='secondary'
                                        sx={{ ml: 2 }}
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </>
    )
}

export default styled(AddUser)(style);
