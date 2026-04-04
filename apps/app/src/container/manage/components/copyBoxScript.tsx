import { Button, Card, CardContent, Snackbar, Typography, Box, Modal, Fade } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

interface CopyBoxProps {
  open: boolean;
  handleCopyClose: () => void;
}

interface IconWithCopyBoxProps {
  text: string;
  showBox: boolean;
  copied: boolean;
  copyError: boolean;
  open?: boolean;
  setShowBox: React.Dispatch<React.SetStateAction<boolean>>;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
  setCopyError: React.Dispatch<React.SetStateAction<boolean>>;
  handleCopy: (text: string) => void;
  handleCopyClose: () => void;
} 

const CopyBox = ({ open, handleCopyClose }: CopyBoxProps) => {
  return (
    <Snackbar open={open} autoHideDuration={1500} onClose={handleCopyClose}>
      <MuiAlert elevation={6} variant="filled" severity="success" onClose={handleCopyClose}>
        Copied!
      </MuiAlert>
    </Snackbar>
  );
};

const IconWithCopyBox = ({ text, showBox, copied, copyError, setCopyError, handleCopy, handleCopyClose }: IconWithCopyBoxProps) => {

  return (
    <div>
      <Modal
        open={showBox}
        onClose={handleCopyClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        closeAfterTransition
      >
        <Fade in={showBox}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Card variant="outlined" sx={{ width: '350px', backgroundColor: 'white' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom id="modal-title">
                  Bot Script
                </Typography>
                <hr style={{ margin: '10px 0' }} />
                <Box sx={{ maxHeight: '220px', overflowY: 'auto', mb: 2 }}>
                  <Typography variant="body1">{text}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={() => handleCopy(text)} variant="contained" sx={{ mr: 1, px: 2, py: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>Copy Text</Typography>
                  </Button>
                  <Button onClick={handleCopyClose} variant="contained" sx={{ px: 2, py: 1 }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>Close</Typography>
                  </Button>
                </Box>
                {copyError && (
                  <Snackbar open={copyError} autoHideDuration={5000} onClose={() => setCopyError(false)}>
                    <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => setCopyError(false)}>
                      Unable to copy the script. Please copy it manually.
                    </MuiAlert>
                  </Snackbar>
                )}
                <CopyBox open={copied} handleCopyClose={handleCopyClose} />
              </CardContent>
            </Card>
          </div>
        </Fade>
      </Modal>
    </div>
  );
};

export default IconWithCopyBox;