import { Grid, Typography, TextField, Button, Dialog, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import style from '../style';
import {FormData} from "../../../utils/types";

interface AddTenantProps {
    snackbarOpen: boolean;
    snackbarMessage: string;
    formData: FormData;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTenantAddUser: () => void;
    handleClose: () => void;
    className?: string;
    handleSnackbarClose: () => void;
    open: boolean;
}

function AddUser(props: AddTenantProps) {
    const { snackbarOpen, snackbarMessage, formData, handleInputChange, handleTenantAddUser, handleClose, className, handleSnackbarClose, open } = props;

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
                        <Typography variant='h2'>Add Tenant</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Tenant Name
                                </Typography>
                                <TextField
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Domain
                                </Typography>
                                <TextField
                                    name="domain"
                                    value={formData.domain}
                                    onChange={handleInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Email
                                </Typography>
                                <TextField
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Contact Person Name
                                </Typography>
                                <TextField
                                    name="contact_person_name"
                                    value={formData.contact_person_name}
                                    onChange={handleInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Contact Person Email
                                </Typography>
                                <TextField
                                    name="contact_person_email"
                                    value={formData.contact_person_email}
                                    onChange={handleInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                                    Contact Person Phone
                                </Typography>
                                <TextField
                                    name="contact_person_phone"
                                    value={formData.contact_person_phone}
                                    onChange={handleInputChange}
                                    size='small'
                                    variant='outlined'
                                    margin='none'
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container justifyContent={"flex-end"}>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        onClick={handleTenantAddUser}
                                    >
                                        Add
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