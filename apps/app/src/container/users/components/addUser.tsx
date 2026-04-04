import { Grid, Typography, TextField, Button, Dialog, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import style from '../style';

interface AddUserProps {
    className?: string;
    open: boolean;
    snackbarOpen: boolean;
    snackbarMessage: string;
    formData: any;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleAddUser: () => void;
    handleClose: () => void;
    handleSnackbarClose: () => void;
}

function AddUser({ className, open, snackbarOpen, snackbarMessage, formData, handleInputChange, handleAddUser, handleClose, handleSnackbarClose }: AddUserProps) {
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={className}
                fullWidth
                maxWidth="sm"
            >
                <Grid container sx={{ p: 3 }}>
                    <Grid item xs={12} sx={{ pb: 2 }}>
                        <Typography variant="h2">Add User</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body1" className="textSecondary" sx={{ pb: 1 }}>Username</Typography>
                                <TextField
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    size="small"
                                    variant="outlined"
                                    margin="none"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body1" className="textSecondary" sx={{ pb: 1 }}>Password</Typography>
                                <TextField
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    size="small"
                                    variant="outlined"
                                    margin="none"
                                    fullWidth
                                    type="password"
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body1" className="textSecondary" sx={{ pb: 1 }}>Email</Typography>
                                <TextField
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    size="small"
                                    variant="outlined"
                                    margin="none"
                                    fullWidth
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant="body1" className="textSecondary" sx={{ pb: 1 }}>Phone</Typography>
                                <TextField
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    size="small"
                                    variant="outlined"
                                    margin="none"
                                    fullWidth
                                    type="tel"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container justifyContent="flex-end">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={handleAddUser}
                                    >
                                        Add
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
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
    );
}

export default styled(AddUser)(style);
