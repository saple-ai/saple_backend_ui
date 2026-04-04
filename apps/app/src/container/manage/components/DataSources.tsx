import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Button, Tabs, Tab, Dialog,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, TextField,
  Chip, CircularProgress, Alert,
  styled, Divider, InputAdornment, List, ListItem, ListItemIcon,
  ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageIcon from '@mui/icons-material/Language';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddLinkIcon from '@mui/icons-material/AddLink';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LoadingButton from '@mui/lab/LoadingButton';
import API from '../../../utils/api';

const StyledTableCell = styled(TableCell)(() => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    fontWeight: 600,
    position: 'sticky',
    top: 0,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover },
  '&:last-child td, &:last-child th': { border: 0 },
}));

const statusColor: Record<string, 'default' | 'warning' | 'success' | 'error'> = {
  pending: 'default',
  processing: 'warning',
  trained: 'success',
  failed: 'error',
};

interface WebSource {
  id: number;
  url: string;
  source_type: string;
  status: string;
  pages_fetched: number;
  max_pages: number;
  created_at: string;
}

interface DataSourcesProps {
  open: boolean;
  onClose: () => void;
  botId: number | null;
  tenantId: number | null;
  // File props
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  file: any[];
  fileLoading: boolean;
  handelFileDelete: (name: string) => void;
  selectedFiles: FileList | null;
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileList | null>>;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ name }: { name: string }) {
  if (name.endsWith('.pdf')) return <PictureAsPdfIcon fontSize="small" sx={{ color: '#e53935' }} />;
  return <ArticleIcon fontSize="small" sx={{ color: '#1565c0' }} />;
}

function DataSources({
  open, onClose, botId, tenantId,
  handleFileChange, handleUpload, file, fileLoading, handelFileDelete,
  selectedFiles, setSelectedFiles,
}: DataSourcesProps) {
  const [tab, setTab] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [webTab, setWebTab] = useState(0); // 0=crawl, 1=sitemap, 2=individual
  const [webSources, setWebSources] = useState<WebSource[]>([]);
  const [loadingWebSources, setLoadingWebSources] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [maxPages, setMaxPages] = useState(10);
  const [error, setError] = useState('');

  const sourceTypeMap = ['crawl', 'sitemap', 'individual'];

  const fetchWebSources = async () => {
    if (!botId) return;
    setLoadingWebSources(true);
    try {
      const res = await API.getWebSources(botId);
      setWebSources(res.data.results || res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingWebSources(false);
    }
  };

  useEffect(() => {
    if (open && tab === 1) fetchWebSources();
  }, [open, tab, botId]);

  const handleAddUrl = async () => {
    if (!urlInput.trim()) { setError('Please enter a URL'); return; }
    if (!botId || !tenantId) return;
    setError('');
    setAddingUrl(true);
    try {
      await API.addWebSource({
        bot: botId,
        tenant: tenantId,
        url: urlInput.trim(),
        source_type: sourceTypeMap[webTab],
        max_pages: webTab === 0 ? maxPages : 10,
      });
      setUrlInput('');
      await fetchWebSources();
    } catch (e: any) {
      setError(e?.response?.data?.url?.[0] || 'Failed to add URL');
    } finally {
      setAddingUrl(false);
    }
  };

  const handleDeleteWebSource = async (id: number) => {
    try {
      await API.deleteWebSource(id);
      setWebSources(prev => prev.filter(ws => ws.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ mb: 2 }}>Data Sources</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Train your bot on files and websites. After adding sources, click "Train Agent" to update the bot.
        </Typography>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab icon={<InsertDriveFileIcon />} iconPosition="start" label="Files" />
          <Tab icon={<LanguageIcon />} iconPosition="start" label="Website" />
        </Tabs>

        {/* ── FILES TAB ── */}
        {tab === 0 && (
          <Box>
            <Grid container spacing={2}>
              {/* Drop zone */}
              <Grid item xs={12}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload-input"
                />
                <Box
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const dt = e.dataTransfer.files;
                    if (dt && dt.length > 0) {
                      // Synthesize a change event so parent handler works unchanged
                      const input = document.getElementById('file-upload-input') as HTMLInputElement;
                      // Use DataTransfer to set files on the hidden input
                      const dataTransfer = new DataTransfer();
                      Array.from(dt).forEach(f => dataTransfer.items.add(f));
                      input.files = dataTransfer.files;
                      input.dispatchEvent(new Event('change', { bubbles: true }));
                      setSelectedFiles(dataTransfer.files);
                    }
                  }}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  sx={{
                    border: '2px dashed', borderColor: dragging ? 'primary.main' : '#ccc',
                    borderRadius: 2, p: 4, textAlign: 'center',
                    bgcolor: dragging ? '#f0f7ff' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.2s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: '#f0f7ff' },
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 44, color: dragging ? 'primary.main' : '#aaa', mb: 1 }} />
                  <Typography variant="body1" sx={{ mb: 0.5 }}>
                    {dragging
                      ? 'Drop files here'
                      : <>Drag & drop or <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>browse files</Box></>
                    }
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports PDF, DOC, DOCX, TXT
                  </Typography>
                </Box>
              </Grid>

              {/* Pending queue — files selected but not yet uploaded */}
              {selectedFiles && selectedFiles.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ border: '1px solid', borderColor: 'primary.light', borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, py: 1, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'primary.light' }}>
                      <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                        Ready to upload — {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Click "Upload Files" to save
                      </Typography>
                    </Box>
                    <List dense disablePadding>
                      {Array.from(selectedFiles).map((f, i) => (
                        <ListItem
                          key={i}
                          divider={i < selectedFiles.length - 1}
                          sx={{ bgcolor: '#fff' }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <FileTypeIcon name={f.name} />
                          </ListItemIcon>
                          <ListItemText
                            primary={f.name}
                            secondary={formatBytes(f.size)}
                            primaryTypographyProps={{ variant: 'body2', noWrap: true, sx: { maxWidth: 500 } }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                          <ListItemSecondaryAction>
                            <Chip label="pending" size="small" sx={{ bgcolor: '#fff8e1', color: '#f57f17', fontWeight: 500, fontSize: 11 }} />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              )}

              {/* Already uploaded files */}
              {file.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Uploaded Files <Chip label={file.length} size="small" color="primary" sx={{ ml: 1 }} />
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 260 }}>
                    <Table stickyHeader size="small">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>File Name</StyledTableCell>
                          <StyledTableCell>Date Uploaded</StyledTableCell>
                          <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {file
                          .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
                          .map((f) => (
                            <StyledTableRow key={f.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <FileTypeIcon name={f.name} />
                                  <Typography variant="body2">{f.name}</Typography>
                                </Box>
                              </TableCell>
                              <StyledTableCell>
                                {new Date(f.created_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    loading={fileLoading}
                    disabled={!selectedFiles || selectedFiles.length === 0}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Files {selectedFiles && selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                  </LoadingButton>
                  <Button variant="outlined" onClick={onClose}>Close</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ── WEBSITE TAB ── */}
        {tab === 1 && (
          <Box>
            <Tabs value={webTab} onChange={(_, v) => setWebTab(v)} sx={{ mb: 3 }} variant="fullWidth">
              <Tab label="Crawl Links" />
              <Tab label="Sitemap" />
              <Tab label="Individual Link" />
            </Tabs>

            <Box sx={{ mb: 1 }}>
              {webTab === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Crawl a website recursively — the bot will follow links up to the max pages limit.
                </Typography>
              )}
              {webTab === 1 && (
                <Typography variant="body2" color="text.secondary">
                  Submit a sitemap URL (e.g. https://example.com/sitemap.xml) to load all listed pages.
                </Typography>
              )}
              {webTab === 2 && (
                <Typography variant="body2" color="text.secondary">
                  Add a single specific page URL to include in training.
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AddLinkIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              {webTab === 0 && (
                <TextField
                  size="small"
                  type="number"
                  label="Max Pages"
                  value={maxPages}
                  onChange={(e) => setMaxPages(Number(e.target.value))}
                  sx={{ width: 120 }}
                  inputProps={{ min: 1, max: 100 }}
                />
              )}
              <LoadingButton variant="contained" onClick={handleAddUrl} loading={addingUrl} sx={{ whiteSpace: 'nowrap' }}>
                Add Link
              </LoadingButton>
            </Box>

            {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

            <Divider sx={{ my: 2 }} />

            {loadingWebSources ? (
              <Box sx={{ textAlign: 'center', py: 3 }}><CircularProgress /></Box>
            ) : webSources.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <LanguageIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                <Typography>No web sources added yet.</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 320 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>URL</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell>Pages</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Added</StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {webSources.map((ws) => (
                      <StyledTableRow key={ws.id}>
                        <StyledTableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ws.url}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip label={ws.source_type} size="small" variant="outlined" />
                        </StyledTableCell>
                        <StyledTableCell>{ws.pages_fetched || '—'}</StyledTableCell>
                        <StyledTableCell>
                          <Chip label={ws.status} size="small" color={statusColor[ws.status] || 'default'} />
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(ws.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton size="small" onClick={() => handleDeleteWebSource(ws.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={onClose}>Close</Button>
            </Box>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}

export default DataSources;
