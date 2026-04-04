import React, { useRef, useState } from 'react';
import {
  Grid, Typography, Button, Dialog, TableContainer, TableHead,
  TableRow, Paper, Table, TableBody, TableCell, styled, IconButton, Box, Chip,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

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
    backgroundColor: '#EADAFD', color: '#222', position: 'sticky', top: 0,
  },
  [`&.MuiTableCell-body`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadDocument({
  open, handleUpload, handleDocClose, file, loading,
  handelFileDelete, selectedFiles, setSelectedFiles,
}: UploadDocumentProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const mergeFiles = (incoming: FileList) => {
    // Merge with existing selectedFiles, deduplicating by name
    const existing = selectedFiles ? Array.from(selectedFiles) : [];
    const newFiles = Array.from(incoming).filter(
      (f) => !existing.some((e) => e.name === f.name)
    );
    const merged = [...existing, ...newFiles];
    // Build a new DataTransfer to produce a FileList
    const dt = new DataTransfer();
    merged.forEach((f) => dt.items.add(f));
    setSelectedFiles(dt.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      mergeFiles(e.target.files);
    }
    // Reset so same file can be re-selected if removed
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) mergeFiles(e.dataTransfer.files);
  };

  const removeSelectedFile = (name: string) => {
    if (!selectedFiles) return;
    const remaining = Array.from(selectedFiles).filter((f) => f.name !== name);
    if (remaining.length === 0) { setSelectedFiles(null); return; }
    const dt = new DataTransfer();
    remaining.forEach((f) => dt.items.add(f));
    setSelectedFiles(dt.files);
  };

  const pendingFiles = selectedFiles ? Array.from(selectedFiles) : [];

  return (
    <Dialog
      open={open}
      onClose={handleDocClose}
      fullWidth
      maxWidth="md"
    >
      <Grid container sx={{ p: 3 }} spacing={2}>
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2">Upload Documents</Typography>
          <IconButton onClick={handleDocClose} size="small"><CloseIcon /></IconButton>
        </Grid>

        {/* Drop zone */}
        <Grid item xs={12}>
          <Box
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            sx={{
              border: `2px dashed ${dragging ? '#7C4DFF' : '#C4C4C4'}`,
              borderRadius: 2,
              background: dragging ? 'rgba(124,77,255,0.05)' : '#FAFAFA',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              '&:hover': { borderColor: '#7C4DFF', background: 'rgba(124,77,255,0.03)' },
            }}
          >
            <UploadFileIcon sx={{ fontSize: 40, color: dragging ? '#7C4DFF' : '#9CA3AF' }} />
            <Typography fontWeight={600} color={dragging ? 'primary' : 'text.primary'}>
              Drag & drop files here, or click to browse
            </Typography>
            <Typography variant="caption" color="text.secondary">
              PDF, DOC, DOCX — multiple files supported
            </Typography>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              style={{ display: 'none' }}
              onChange={handleInputChange}
            />
          </Box>
        </Grid>

        {/* Selected files (pending upload) */}
        {pendingFiles.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Ready to upload ({pendingFiles.length} file{pendingFiles.length > 1 ? 's' : ''})
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {pendingFiles.map((f) => (
                <Box
                  key={f.name}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    p: '8px 12px', borderRadius: 1,
                    background: '#F3F4F6', border: '1px solid #E5E7EB',
                  }}
                >
                  <InsertDriveFileOutlinedIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                  <Typography fontSize={13} sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.name}
                  </Typography>
                  <Chip label={formatBytes(f.size)} size="small" sx={{ fontSize: 11 }} />
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeSelectedFile(f.name); }}>
                    <CloseIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        )}

        {/* Already uploaded files */}
        {file.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Uploaded Documents ({file.length})
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 280 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>File name</StyledTableCell>
                    <StyledTableCell>Uploaded</StyledTableCell>
                    <StyledTableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {file
                    .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
                    .map((f) => (
                      <StyledTableRow key={f.id}>
                        <StyledTableCell>{f.name}</StyledTableCell>
                        <StyledTableCell>
                          {new Date(f.created_date).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton size="small" onClick={() => handelFileDelete(f.name)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {/* Actions */}
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end" gap={1}>
            <Button size="small" disableElevation variant="contained" color="secondary" onClick={handleDocClose}>
              Close
            </Button>
            <LoadingButton
              disableElevation size="small" variant="contained" color="primary"
              onClick={handleUpload}
              loading={loading}
              disabled={pendingFiles.length === 0}
              loadingIndicator={<CircularProgress color="warning" sx={{ color: 'white' }} size={20} />}
            >
              Upload {pendingFiles.length > 0 ? `(${pendingFiles.length})` : ''}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default UploadDocument;
