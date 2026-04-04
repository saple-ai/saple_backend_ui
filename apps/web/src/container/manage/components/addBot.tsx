import { Grid, Typography, TextField, Select, FormControl, MenuItem, Button, Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';
import style from '../style';
import {Container, FormDataStep1, FormDataStep2, FormDataStep3, Storage} from "../../../utils/types";

interface AddUserProps {
  className?: string;
  open: boolean;
  id: number | string;
  currentStep: number;
  formDataStep1: FormDataStep1;
  formDataStep2: FormDataStep2;
  formDataStep3: FormDataStep3;
  blobStorages: Storage[];
  handleInputChangeStep1: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChangeStep2: () => void;
  handleInputChangeStep3: () => void;
  handleNext: () => void;
  handleBack: () => void;
  handleClose: () => void;
  handleAddUser: () => void;
  handleAddAzureStorage: () => void;
  editMode: boolean;
  containerData: Container[];
}

function AddUser(props: AddUserProps) {
  const { className, open, id, currentStep, formDataStep1, formDataStep2, formDataStep3, blobStorages, handleInputChangeStep1, handleInputChangeStep2, handleInputChangeStep3, handleNext, handleBack, handleClose, handleAddUser, handleAddAzureStorage, editMode, containerData } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={className}
      fullWidth
      maxWidth={"sm"}
      key="add-user-dialog"
    >
      <Grid container sx={{ p: 3 }}>
        <Grid item xs={12} sx={{ pb: 2 }}>
          <Typography variant='h2'> Bot </Typography>
        </Grid>
        <Grid item xs={12}>
          <form>
            {currentStep === 1 && (
              <>
                <Grid item xs={12} md={12}>
                  <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                    Bot Name
                  </Typography>
                  <TextField
                    name="name"
                    value={formDataStep1.name}
                    onChange={handleInputChangeStep1}
                    size='small'
                    variant='outlined'
                    margin='none'
                    fullWidth
                  />
                </Grid>
              </>
            )}
            {currentStep === 2 && (
              <>
                <Grid item xs={12} md={12}>
                  <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                    Storage
                  </Typography>
                  <FormControl fullWidth>
                    {formDataStep2.type === 'existing' ? (
                      <Select
                        name="blob_storage"
                        value={formDataStep2.blob_storage}
                        onChange={handleInputChangeStep2}
                        displayEmpty
                        sx={{
                          '& .MuiSelect-select': {
                            color: 'rgba(0, 0, 0, 0.5)',
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Select the required storage
                        </MenuItem>
                        {Array.isArray(blobStorages) && blobStorages
                          .filter(blobStorage => blobStorage.tenant === parseInt(id as unknown as string))
                          .map(blobStorage => (
                            <MenuItem key={blobStorage.id} value={blobStorage.id}>
                              {blobStorage.account_name}
                            </MenuItem>
                          ))}
                      </Select>
                    ) : !editMode && (
                      <>
                        <TextField
                          name="account_name"
                          value={formDataStep2.account_name}
                          onChange={handleInputChangeStep2}
                          size='small'
                          variant='outlined'
                          margin='none'
                          fullWidth
                          placeholder="Account Name"
                        />
                        <TextField
                          name="account_key"
                          value={formDataStep2.account_key}
                          onChange={handleInputChangeStep2}
                          size='small'
                          variant='outlined'
                          margin='none'
                          fullWidth
                          placeholder="Account Key"
                        />
                      </>
                    )}
                  </FormControl>
                  {formDataStep2.type === 'existing' && !editMode && (
                    <Button size="small" variant="contained" color="primary" sx={{ mt: 1 }} onClick={handleAddAzureStorage}>
                      Add Azure Storage
                    </Button>
                  )}
                </Grid>
              </>
            )}
            {currentStep === 3 && !editMode && (
              <>
                <Grid item xs={12} md={12}>
                  <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                    Container Name
                  </Typography>
                  <TextField
                    name="container_name"
                    value={formDataStep3.container_name}
                    onChange={handleInputChangeStep3}
                    size='small'
                    variant='outlined'
                    margin='none'
                    fullWidth
                  />
                  <Typography>
                    <i>*Use only lower case letters</i>
                  </Typography>
                </Grid>
              </>
            )}
            {currentStep === 3 && editMode && (
              <>
                <Grid item xs={12} md={12}>
                  <Typography variant='body1' className='textSecondary' sx={{ pb: 1 }}>
                    Container Name
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="container_name"
                      value={formDataStep3.container_name}
                      onChange={handleInputChangeStep3}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          color: 'rgba(0, 0, 0, 0.5)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select the required container
                      </MenuItem>
                      {Array.isArray(containerData) && containerData
                        .filter(container => container.blob_storage === formDataStep2.blob_storage)
                        .map(container => (
                          <MenuItem key={container.id} value={container.id}>
                            {container.name}
                          </MenuItem>
                        ))}
                    </Select>

                  </FormControl>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Grid container justifyContent={"flex-end"}>
                {currentStep !== 1 && (
                  <Button size="small" variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleBack}>
                    Back
                  </Button>
                )}
                {currentStep !== 3 && (
                  <Button size="small" variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleNext}>
                    Next
                  </Button>
                )}
                {currentStep === 3 && (
                  <>
                    <Button size='small' variant='contained' color='primary' sx={{ ml: 2 }} onClick={handleAddUser}>
                      {editMode ? 'Edit' : 'Add'}
                    </Button>
                    <Button size='small' variant='contained' color='secondary' sx={{ ml: 2 }} onClick={handleClose}>
                      Cancel
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Dialog>
  )
}

export default styled(AddUser)(style);