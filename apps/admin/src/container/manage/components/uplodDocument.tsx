import React from 'react';
import {
  Grid,
  Typography,
  Button,
  Dialog,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Table,
  TableBody,
  TableCell,
  styled,
  IconButton
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';

interface UploadDocumentProps {
  open: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  handleDocClose: () => void;
  file: any[];
  loading: boolean;
  handelFileDelete: (name: string) => void;
  onClose: () => void;
  userId: number | null;
  selectedFiles: FileList | null;
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
  selectedUserId: number | null;
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: '#EADAFD',
    color: '#222',
    position: 'sticky',
    top: 0,
  },
  [`&.MuiTableCell-body`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function UploadDocument({ open, handleFileChange, handleUpload, handleDocClose, file, loading, handelFileDelete }: UploadDocumentProps) {
  return (
    <Dialog
      open={open}
      onClose={handleDocClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="lg"
      key="add-user-dialog"
    >
      <Grid container sx={{ p: 3 }}>
        <Grid item xs={12} sx={{ pb: 2 }}>
          <Typography variant='h2'>Upload Documents</Typography>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
              />
              <br />
              <Typography><i>Please upload files with file types Pdf, Doc, and Docx</i></Typography>
            </Grid>

            {file.length > 0 && (
              <Grid item xs={12}>
                <Typography variant='h4' sx={{ pb: 1 }}>Uploaded Documents: {file.length} Files</Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                  <Table stickyHeader aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Files</StyledTableCell>
                        <StyledTableCell>Date of upload</StyledTableCell>
                        <StyledTableCell align="right"></StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {file
                        // Sort files by created_date in descending order
                        .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
                        .map((selectedFile) => (
                          <StyledTableRow key={selectedFile.id}>
                            <StyledTableCell component="th" scope="row" style={{padding: '8px 16px'}}>
                              {selectedFile.name}
                            </StyledTableCell>
                            <StyledTableCell style={{padding: '8px 16px'}}>
                              <span style={{ fontWeight: 'bold' }}>{new Date(selectedFile.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </StyledTableCell>
                            <StyledTableCell align="right" style={{padding: '8px 16px'}}>
                              <IconButton onClick={() => handelFileDelete(selectedFile.name)}>
                                <DeleteIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
            <Grid item xs={12}>
              <Grid container justifyContent="flex-end">
                <LoadingButton disableElevation size="small" variant="contained" color="primary" onClick={handleUpload} loading={loading} loadingIndicator={<CircularProgress color="warning" sx={{ color: 'white', fontWeight: '600' }} size={25} />}>Upload</LoadingButton>
                <Button size="small" disableElevation variant="contained" color="secondary" sx={{ ml: 2 }} onClick={handleDocClose}>Close</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default UploadDocument;
