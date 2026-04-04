import React, { useState, useEffect } from "react";
import EmptyState from "../../components/EmptyState";
import { useParams } from "react-router-dom";
import {
  IconButton,
  Grid,
  Typography,
  Breadcrumbs,
  Link as Links,
  Snackbar,
  Switch,
  Modal
} from "@mui/material";
import { styled } from "@mui/system";
import { Table } from "../../components/index";
import style from "./style";
import AddUser from "./components/addBot";
import Copy from "./components/copyBoxScript";
import DataSources from "./components/DataSources";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Add as AddIcon } from "@mui/icons-material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import loadingGif from "../../assets/gif/loading.gif";
import API from "../../utils/api";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Confirmation from "../confirmationDialog/index";
import { BrowserUpdated as BrowserUpdatedIcon } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { ChromePicker } from "react-color";
import ScheduleIcon from '@mui/icons-material/Schedule';
import HubIcon from '@mui/icons-material/Hub';
import FormControlLabel from '@mui/material/FormControlLabel';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ChatIcon from '@mui/icons-material/Chat';
// import DescriptionIcon from '@mui/icons-material/Description';
import PaletteIcon from '@mui/icons-material/Palette';
import ApiIcon from '@mui/icons-material/Api';
import Chip from '@mui/material/Chip';
// import FormatSizeIcon from '@mui/icons-material/FormatSize';

import {
  Tenant,
  Container,
  FormDataStep1,
  FormDataStep2,
  FormDataStep3,
  Storage,
  TrainingResult,
} from "../../utils/types";

const TRAINING_URL = import.meta.env.VITE_TRAINING_URL;
const APP_URL = import.meta.env.VITE_URL;

interface CustomTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface User {
  id: number;
  uuid: string;
  tenant_uuid: string;
  name: string;
  container: number;
  created_by_name: string;
  created_date: string;
  blob_storage: number;
  tenant: number;
  containerName?: string;
  media_type?: "audio" | "text" | "both";
  model?: string;
  prompt?: string;
  color?: string;
  font?: string;
  font_style?: string;
  font_size?: string;
  default_model?: string;
  welcome_message?: string;
  calendly_enabled?: boolean;
  calendly_link?: string | null;
  hubspot_enabled?: boolean;
}

interface History {
  id: number;
  container: number;
  status: string;
  message: string;
  created_date: string;
}

interface IconStates {
  [key: number]: boolean;
}

interface UserProps {
  className?: string;
  handleSnackbarClose: () => void;
}

function CustomTabPanel(props: CustomTabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      className="tabBody"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function User(props: UserProps) {
  const { className, handleSnackbarClose } = props;
  const [value, setValue] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [containerst, setcontainer] = useState<string>("");
  const [containerData, setContainer] = useState<Container[]>([]);
  const [management, setManagement] = useState<string>("Bot Management");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [userData, _setUserData] = useState<User | {}>({});
  const [openAddUser, setOpenAddUser] = useState<boolean>(false);
  const [iconStates, setIconStates] = useState<IconStates>({});
  const [openUploadDocument, setOpenUploadDocument] = useState<boolean>(false);
  const [openBotCopy, setOpenBotCopy] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [storage, setStorage] = useState<Storage[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formDataStep1, setFormDataStep1] = useState<FormDataStep1>({
    name: (userData as User).name || "",
  });
  const [formDataStep2, setFormDataStep2] = useState<FormDataStep2>({
    type: "existing",
    blob_storage: "",
    account_name: "",
    account_key: "",
  });
  const [formDataStep3, setFormDataStep3] = useState<FormDataStep3>({
    type: "existing",
    container_name: "",
  });

  const availableModels = [
    // ── OpenAI ──────────────────────────────
    "gpt-4o",           // Best quality, great for complex support
    "gpt-4o-mini",      // Fast & cost-effective ✓ recommended
    // ── Anthropic Claude ────────────────────
    "claude-opus-4-5",               // Most capable Claude
    "claude-sonnet-4-5",             // Best balance for customer support
    "claude-3-5-sonnet-20241022",    // Excellent instruction following
    "claude-3-5-haiku-20241022",     // Very fast, low cost
    // ── Google Gemini ───────────────────────
    "gemini-2.0-flash",              // Fast, good quality
    "gemini-1.5-pro",               // High quality, long context
    "gemini-1.5-flash",             // Fast & affordable
  ];
  const [activeSection, setActiveSection] = useState('media');
  const [blobStorages, setBlobStorages] = useState<Storage[]>([]);
  const [_alertMessage, setAlertMessage] = useState<string | null>(null);
  const [newStorageId, setNewStorageId] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const [showBox, setShowBox] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copyError, setCopyError] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [_deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [fileNameToDelete, setFileNameToDelete] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [history, setHistory] = useState<History[] | null>(null);
  const [orgid, setOrgId] = useState<number | null>(null);
  const [deletion, setDeletion] = useState<boolean>();
  const [ConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [training, setTraining] = useState<string | null>(null);
  const [tab, setTab] = useState<number>(0);
  const [file, setFile] = useState<any>("");
  const [uploadingLoading, setUploadingLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileDelete, setFileDelete] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<User | null>(null);
  // @ts-ignore
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0] || "gpt-4o-mini");
  const [promptTemplate, setPromptTemplate] = useState<string>("");
  const [welcomeMessage, setWelcomeMessage] = useState<string>("");
  const [botColor, setBotColor] = useState<string>("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [calendlyEnabled, setCalendlyEnabled] = useState<boolean>(false);
  const [calendlyLink, setCalendlyLink] = useState<string>("");
  const [openCalendly, setOpenCalendly] = useState(false);
  const [calendlyError, setCalendlyError] = useState<string>("");
  const [hubspotEnabled, setHubspotEnabled] = useState<boolean>(false);
  const [customApiIntegration, setCustomApiIntegration] = useState<{ id: number; config: Record<string, string>; enabled: boolean } | null>(null);
  const [customApiEndpoints, setCustomApiEndpoints] = useState<{ id: number; name: string; description: string; method: string; path: string }[]>([]);
  const [customApiLoading, setCustomApiLoading] = useState(false);
  const [availableFonts] = useState([
    // Modern tech/sci-fi inspired
    'Exo',
    'Exo 2',
    'Orbitron',
    'Rajdhani',
    'Titillium Web',
    'Aldrich',
    'Electrolize',

    // Clean sans-serif
    'Roboto',
    'Inter',
    'Open Sans',
    'Montserrat',
    'Poppins',
    'Lato',
    'Nunito',
    'Ubuntu',
    'Fira Sans',
    'Source Sans Pro',

    // Geometric/modern
    'Raleway',
    'Quicksand',
    'Work Sans',
    'Rubik',
    'Karla',
    'Archivo',

    // Tech/console style
    'Share Tech Mono',
    'Space Mono',
    'Courier Prime',
    'IBM Plex Mono',

    // Futuristic
    'Michroma',
    'Audiowide',
    'Wallpoet',

    // Minimalist
    'Manrope',
    'Spartan',
    'Lexend',

    // System fallbacks
    'Arial',
    'Helvetica',
    'Verdana',
    'Segoe UI'
  ]);
  // const [selectedFont, setSelectedFont] = useState('Arial');

  const updateBotFont = async (botId: number, font: string) => {
    try {
      // Update local state immediately for responsive UI
      setSelectedBot(prev => prev ? { ...prev, font } : null);

      // Update the users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, font } : user
        )
      );

      // Call API to update the font
      await API.updateBotFont(botId.toString(), font);

      setSnackbarMessage("Font updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update font:", error);
      setSnackbarMessage("Failed to update font");
      setSnackbarOpen(true);
    }
  };
  const updateBotFontStyle = async (botId: number, fontStyle: string) => {
    try {
      // Update local state immediately for responsive UI
      setSelectedBot(prev => prev ? { ...prev, font_style: fontStyle } : null);

      // Update the users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, font_style: fontStyle } : user
        )
      );

      // Call API to update the font style
      await API.updateBotFontStyle(botId.toString(), fontStyle);

      setSnackbarMessage("Font style updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update font style:", error);
      setSnackbarMessage("Failed to update font style");
      setSnackbarOpen(true);
    }
  };

  const updateBotFontSize = async (botId: number, fontSize: string) => {
    try {
      // Update local state immediately for responsive UI
      setSelectedBot(prev => prev ? { ...prev, font_size: fontSize } : null);

      // Update the users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, font_size: fontSize } : user
        )
      );

      // Call API to update the font size
      await API.updateBotFontSize(botId.toString(), fontSize);

      setSnackbarMessage("Font size updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update font size:", error);
      setSnackbarMessage("Failed to update font size");
      setSnackbarOpen(true);
    }
  };
  const isValidCalendlyLink = (link: string): boolean => {
    // Basic pattern for Calendly URLs
    const basePattern = /^https?:\/\/(www\.)?calendly\.com\/[a-zA-Z0-9_-]+/i;

    // Optional event type path
    const eventPattern = /(\/[a-zA-Z0-9_-]+)?/;

    // Optional query parameters (must start with ? and contain valid chars)
    const queryPattern = /(\?[a-zA-Z0-9_&=%-]+)?/;

    // Optional hash/anchor
    const hashPattern = /(#[a-zA-Z0-9_-]+)?$/;

    const fullPattern = new RegExp(
      basePattern.source +
      eventPattern.source +
      queryPattern.source +
      hashPattern.source
    );

    return fullPattern.test(link);
  };

  // const handleOpenCalendly = (user: User) => {
  //   setSelectedBot(user);
  //   setCalendlyLink(user.calendly_link || "");
  //   setCalendlyEnabled(user.calendly_enabled || false);
  //   setCalendlyError("");
  //   setOpenCalendly(true);
  // };

  const handleCloseCalendly = () => {
    setOpenCalendly(false);
    setCalendlyError("");
  };

  const updateBotCalendlySettings = async () => {
    if (!selectedBot) return;

    try {
      // Only update enabled status
      if (selectedBot.calendly_enabled !== calendlyEnabled) {
        await API.updateBotCalendlyEnabled(
          selectedBot.id.toString(),
          calendlyEnabled
        );
      }

      // Update local state
      setUsers(users.map(user =>
        user.id === selectedBot.id
          ? { ...user, calendly_enabled: calendlyEnabled }
          : user
      ));

      setSnackbarMessage("Calendly settings updated successfully");
      setSnackbarOpen(true);
      handleCloseCalendly();
    } catch (error) {
      console.error("Failed to update Calendly settings:", error);
      setSnackbarMessage("Failed to update Calendly settings");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orgId = await API.users();
        setOrgId(orgId.data[0].tenant);
        const history = await API.traininghistorystatus(
          id ? id : orgId.data[0].tenant
        );
        setHistory(history.data);
        const response = await API.bots();
        setUsers(response.data);
        const container = await API.blobsContainers();
        setContainer(container.data);
        const storageResponse = await API.blobStorage();
        setStorage(storageResponse.data);
        const orgResponse = await API.tenants();
        setTenants(orgResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const role = sessionStorage.getItem("role");
    const isAdmin = role === "admin";
    const isSuperAdmin = role === "superadmin";

    setValue(isAdmin || isSuperAdmin ? tab : 1);
    setManagement(
      isAdmin || isSuperAdmin ? "Bot Management" : "Training Management"
    );
    setTraining(null);
  }, [training]);

  useEffect(() => {
    const fetchContainerName = async () => {
      if (!users) {
        return;
      }
      try {
        const response = await API.blobsContainers();
        const containers = response.data;
        const updatedUsers = users.map((user: User) => {
          const container = containers.find(
            (container: Container) => container.id === user.container
          );
          return {
            ...user,
            containerName: container ? container.name : "Unknown",
          };
        });
        if (JSON.stringify(updatedUsers) !== JSON.stringify(users)) {
          setUsers(updatedUsers);
        }
      } catch (error) {
        console.error("Error fetching container name:", error);
      }
    };
    fetchContainerName();
  }, [users]);

  const filteredUsers = users.filter((user) => {
    const tenantId = tenants.find(
      (o) => o.id === storage.find((s) => s.id === user.blob_storage)?.tenant
    )?.id;
    return tenantId === parseInt(id || "");
  });

  const handleAdd = () => {
    setEditMode(false);
    setOpenAddUser(true);
  };

  const handleGearClick = (user: User) => {
    setSelectedBot(user);
    setPromptTemplate(user.prompt || '');
    setWelcomeMessage(user.welcome_message || '');
    setCalendlyEnabled(user.calendly_enabled || false);
    setHubspotEnabled(user.hubspot_enabled || false);
    setDrawerOpen(true);
  };

  const handleDelete = async (userId: number) => {
    setUserIdToDelete(userId);
    setDeleteConfirmationOpen(true);
    setConfirmationOpen(true);
    setDeletion(true);
  };

  const handleDeleteConfirmed = async () => {
    if (fileDelete) {
      try {
        const container = users.find((user) => user.id === selectedUserId);
        if (container && fileNameToDelete) {
          await API.blobsFilesDelete(
            container.container as unknown as string,
            fileNameToDelete
          );
          setDeleteConfirmationOpen(false);
          setConfirmationOpen(false);
          setSnackbarMessage("File Deleted Successfully");
          setSnackbarOpen(true);
          handleCloseUploadDocument();
          if (selectedUserId) {
            await handleOpenUploadDocument(selectedUserId);
          }
          setFileDelete(false);
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 2000);
        }
      } catch (error) {
        setSnackbarMessage("Error deleting File");
        setSnackbarOpen(true);
        setDeleteConfirmationOpen(false);
        setFileDelete(false);
        console.error("Error deleting File:", error);
      }
    } else {
      try {
        if (userIdToDelete) {
          await API.botsDelete(userIdToDelete as unknown as string);
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userIdToDelete)
          );
          setDeleteConfirmationOpen(false);
          setConfirmationOpen(false);
          setSnackbarMessage("Bot Deleted Successfully");
          setSnackbarOpen(true);
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 2000);
        }
      } catch (error) {
        setSnackbarMessage("Error deleting Bot");
        setSnackbarOpen(true);
        setDeleteConfirmationOpen(false);
        console.error("Error deleting Bot:", error);
      }
    }
  };

  const handelFileDelete = async (fileName: string) => {
    setFileNameToDelete(fileName);
    setFileDelete(true);
    setDeleteConfirmationOpen(true);
    setConfirmationOpen(true);
    setDeletion(true);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setManagement(newValue === 0 ? "Bot Management" : "Training Management");
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

  const handleIconClick = async (userId: number) => {
    try {
      const user = users.find((user) => user.id === userId);
      if (!user) return;

      const { blob_storage: blobStorageId } = user;
      const blobStorageData = storage.find(
        (storage) => storage.id === blobStorageId
      );
      if (!blobStorageData) return;

      const userContainerId = user.container;
      const container = containerData.find(
        (container) => container.id === userContainerId
      );
      const containerName = container ? container.name : "Unknown";
      const t = user.tenant ? user.tenant.toString() : "";
      const b = container!.blob_storage
        ? container!.blob_storage.toString()
        : "";
      const bot_id = user?.id;
      const trainingData = {
        account_name: blobStorageData.account_name,
        account_key: blobStorageData.account_key,
        container_name: containerName,
        tenant_id: t,
        blob_storage_id: b,
        bot_id: bot_id,
      };

      setIconStates((prevState) => ({
        ...prevState,
        [userId]: true,
      }));

      const response = await fetch(TRAINING_URL || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingData),
      });

      if (!response.ok) {
        throw new Error("Error triggering trainModel API");
      }

      const responseData = await response.json();
      const trainingHistory: TrainingResult = {
        time_taken_to_generate_embedding_vectors:
          responseData.time_taken_to_generate_embedding_vectors,
        time_taken_to_process_files_from_blob_storage:
          responseData.time_taken_to_process_files_from_blob_storage,
        message: responseData.message,
        status: responseData.status,
        container: user.container,
        tenant: user.tenant,
        blob_storage: user.blob_storage,
        bot: user.id,
      };

      await API.traininghistory(trainingHistory);
      setSnackbarOpen(true);
      setSnackbarMessage(trainingHistory.status);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);

      setTraining(trainingHistory.status);
      setTab(1);
      setTimeout(() => {
        setIconStates((prevState) => ({
          ...prevState,
          [userId]: false,
        }));
      });
    } catch (error) {
      console.error("Error triggering trainModel API:", error);
      setIconStates((prevState) => ({
        ...prevState,
        [userId]: false,
      }));
    }
  };

  const handleOpenUploadDocument = async (userId: number) => {
    const container = users.find((user) => user.id === userId);
    setSelectedUserId(userId);
    setUploadingLoading(true);
    if (container) {
      const file = await API.blobsFiles(
        container.container as unknown as string
      );
      setFile(file.data);
    }
    setUploadingLoading(false);
    setOpenUploadDocument(true);
  };

  const handleCopyBot = (userId: number) => {
    setSelectedUserId(userId);
    setOpenBotCopy(true);
    setShowBox(true);
  };

  const handleCloseUploadDocument = () => {
    setOpenUploadDocument(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.blobStorage();
        setBlobStorages(response.data);
      } catch (error) {
        console.error("Error fetching blob_storage:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (editMode) {
      setFormDataStep1({ name: (userData as User).name || "" });
      setFormDataStep2({
        ...formDataStep2,
        blob_storage: (userData as User).blob_storage || "",
      });
    } else {
      setFormDataStep1({ name: "" });
      setFormDataStep2({
        type: "existing",
        blob_storage: "",
        account_name: "",
        account_key: "",
      });
    }
  }, [editMode, userData]);

  const handleInputChangeStep1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataStep1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChangeStep2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataStep2((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChangeStep3 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataStep3((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    if (currentStep === 1 && formDataStep1.name.trim() !== "") {
      setCurrentStep(currentStep + 1);
    } else if (
      currentStep === 2 &&
      formDataStep2.type === "existing" &&
      formDataStep2.blob_storage !== ""
    ) {
      setCurrentStep(currentStep + 1);
    } else if (
      currentStep === 2 &&
      formDataStep2.type === "new" &&
      formDataStep2.account_name!.trim() !== "" &&
      formDataStep2.account_key!.trim() !== ""
    ) {
      try {
        const response = await API.blobStoragePost(
          formDataStep2.account_name!,
          formDataStep2.account_key!,
          id ? (id as unknown as string) : (orgid as unknown as string)
        );
        setNewStorageId(response.data.id);
        setFormDataStep2({ type: "existing", blob_storage: response.data.id });
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Error creating new storage:", error);
        setAlertMessage(
          "Failed to create. Please try again later or try with different credentials."
        );
      }
    } else if (
      currentStep === 3 &&
      formDataStep3.type === "existing" &&
      formDataStep3.container_name.trim() !== ""
    ) {
    } else {
      console.error("Required fields are not filled");
      setAlertMessage("Required fields are not filled");
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    handleCloseAddUser();
  };

  const handleAddUser = async () => {
    try {
      if (!editMode) {
        if (currentStep === 1 && formDataStep1.name.trim() !== "") {
          if (
            formDataStep2.type === "new" &&
            formDataStep2.account_name!.trim() !== "" &&
            formDataStep2.account_key!.trim() !== ""
          ) {
            const response = await API.blobStoragePost(
              formDataStep2.account_name!,
              formDataStep2.account_key!,
              id ? (id as unknown as string) : (orgid as unknown as string)
            );
            setNewStorageId(response.data.id);
            setFormDataStep2({
              type: "existing",
              blob_storage: response.data.id,
            });
            setCurrentStep(currentStep + 1);
          } else if (
            formDataStep2.type === "existing" &&
            formDataStep2.blob_storage !== ""
          ) {
            setCurrentStep(currentStep + 1);
          } else {
            console.error("Required fields are not filled");
          }
        } else if (
          currentStep === 2 &&
          ((formDataStep2.type === "existing" &&
            formDataStep2.blob_storage !== "") ||
            (formDataStep2.type === "new" &&
              formDataStep2.account_name!.trim() !== "" &&
              formDataStep2.account_key!.trim() !== ""))
        ) {
          if (formDataStep2.type === "new") {
            const response = await API.blobStoragePost(
              formDataStep2.account_name!,
              formDataStep2.account_key!,
              id ? (id as unknown as string) : (orgid as unknown as string)
            );
            setNewStorageId(response.data.id);
            setFormDataStep2({
              type: "existing",
              blob_storage: response.data.id,
            });
          }
          setCurrentStep(currentStep + 1);
        } else if (
          currentStep === 3 &&
          formDataStep3.type === "existing" &&
          formDataStep3.container_name.trim() !== ""
        ) {
          let storageId;
          if (formDataStep2.type === "new") {
            storageId = newStorageId;
          } else {
            storageId = formDataStep2.blob_storage;
          }
          const containerResponse = await API.blobsContainerspost(
            formDataStep3.container_name,
            storageId as unknown as string,
            id ? (id as unknown as string) : (orgid as unknown as string)
          );
          const containerdata = containerResponse.data;
          setcontainer(containerdata.name);
          const botData = {
            name: formDataStep1.name,
            blob_storage: String(storageId),
            container: String(containerResponse.data.id),
            tenant: String(id || orgid),
          };
          const response = await API.botspost(botData);
          const newUser = response.data;
          setUsers((prevUsers) => [...prevUsers, newUser]);
          setSnackbarMessage("Bot Added successfully");
          setSnackbarOpen(true);
          setTimeout(() => {
            setSnackbarOpen(false);
          }, 2000);
          handleClose();
        } else {
          console.error("Required fields are not filled");
        }
      } else {
        setDeletion(false);
        setConfirmationOpen(true);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditConfirmed = async () => {
    if (
      !(userData as User).id ||
      !formDataStep1.name ||
      !formDataStep2.blob_storage ||
      !formDataStep3.container_name
    ) {
      setSnackbarMessage("All the fields are required");
      setSnackbarOpen(true);
      return;
    }
    setConfirmationOpen(false);
    const response = await API.botsUpdate(
      (userData as User).id as unknown as string,
      formDataStep1.name,
      String(formDataStep2.blob_storage),
      formDataStep3.container_name,
      String(id || orgid)
    );
    const editedUser = response.data;
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === editedUser.id ? editedUser : user))
    );
    setSnackbarMessage("Bot Updated successfully");
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);
    handleClose();
  };

  const handleAddAzureStorage = async () => {
    setFormDataStep2({ ...formDataStep2, type: "new" });
    try {
      if (
        formDataStep2.type === "new" &&
        formDataStep2.account_name!.trim() !== "" &&
        formDataStep2.account_key!.trim() !== ""
      ) {
        const response = await API.blobStoragePost(
          formDataStep2.account_name!,
          formDataStep2.account_key!
        );
        setNewStorageId(response.data.id);
        setFormDataStep2({ type: "existing", blob_storage: response.data.id });
        const refreshedBlobStorages = await API.blobStorage();
        setBlobStorages(refreshedBlobStorages.data);
        setCurrentStep(2);
      } else {
        console.error("Required fields are not filled");
        setAlertMessage("Required fields are not filled");
        setSnackbarMessage("Required fields are not filled");
        setSnackbarOpen(true);
        setTimeout(() => {
          setSnackbarOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding new storage:", error);
      setAlertMessage("Failed to add new storage. Please try again later.");
      setSnackbarMessage("Failed to add new storage. Please try again later.");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Unable to copy to clipboard", err);
      setSnackbarMessage("Unable to copy to clipboard.");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      setCopyError(true);
    }
  };

  const handleCopyClose = () => {
    setCopied(false);
    setShowBox(false);
    setCopyError(false);
    setOpenBotCopy(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error("No files selected.");
      setSnackbarMessage("No files selected");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
      return;
    }
    const container = users.find((user) => user.id === selectedUserId);
    if (!container) return;

    setLoading(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("file", selectedFiles[i]);
    }
    formData.append("container", container.container.toString());
    formData.append("tenant", container.tenant.toString());
    formData.append("blob_storage", container.blob_storage.toString());
    formData.append("bot", container.id.toString());

    try {
      // @ts-ignore
      const response = await API.blobsFilespost(
        formData,
        String(container.container),
        String(container.tenant),
        String(container.blob_storage),
        String(container.id)
      );
      handleDocClose();
      await handleOpenUploadDocument(selectedUserId!);
      setSnackbarMessage("File uploaded successfully");
      setSnackbarOpen(true);
      setLoading(false);

      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error uploading documents:", error);
      setSnackbarMessage("An error occurred while uploading documents.");
      setSnackbarOpen(true);
      setLoading(false);

      setTimeout(() => {
        setSnackbarOpen(false);
      }, 2000);
    }
  };

  const handleDocClose = () => {
    setSelectedFiles(null);
    handleCloseUploadDocument();
  };

  const updateBotMediaType = async (
    botId: number,
    mediaType: "audio" | "text" | "both"
  ) => {
    try {
      const updatedUsers = users.map((user) =>
        user.id === botId
          ? {
            ...user,
            media_type: mediaType,
          }
          : user
      );

      setUsers(updatedUsers);
      // @ts-ignore
      const response = await API.updateBotMediaType(
        botId as unknown as string,
        mediaType
      );
    } catch (error) {
      console.log(
        (error as Error).message || "Failed to update bot media type"
      );
    }
  };

  const updateBotColor = async (botId: number, color: string) => {
    try {
      // Update local state immediately for responsive UI
      setSelectedBot(prev => prev ? { ...prev, color } : null);
      setBotColor(color);

      // Update the users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, color } : user
        )
      );

      // Call API to update the color
      await API.updateBotColor(botId.toString(), color);
    } catch (error) {
      console.error("Failed to update bot color:", error);
      // Optionally show error to user
      setSnackbarMessage("Failed to update bot color");
      setSnackbarOpen(true);
    }
  };

  const updateBotModel = async (botId: number, model: string) => {
    try {
      // Optimistic UI update - update local state immediately
      const updatedUsers = users.map(user =>
        user.id === botId ? { ...user, model, default_model: model } : user
      );
      setUsers(updatedUsers);

      if (selectedBot?.id === botId) {
        setSelectedBot(prev => prev ? { ...prev, model, default_model: model } : null);
      }

      // API call
      const response = await API.updateBotModel(botId.toString(), model);

      // Update with actual data from server
      const updatedBot = response.data;
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updatedBot.id ? updatedBot : user
        )
      );

      if (selectedBot?.id === updatedBot.id) {
        setSelectedBot(updatedBot);
      }

      setSnackbarMessage("Model updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      // Revert on error
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, model: user.default_model || "gpt-4o-mini" } : user
        )
      );

      if (selectedBot?.id === botId) {
        setSelectedBot(prev => prev ? { ...prev, model: prev.default_model || "gpt-4o-mini" } : null);
      }

      console.error("Failed to update model:", error);
      setSnackbarMessage("Failed to update model");
      setSnackbarOpen(true);
    }
  };

  const updateBotWelcomeMessage = async (botId: number, message: string) => {
    try {
      // Update local state immediately for responsive UI
      setSelectedBot(prev => prev ? { ...prev, welcome_message: message } : null);
      setWelcomeMessage(message);

      // Update the users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, welcome_message: message } : user
        )
      );

      // Call API to update the welcome message
      await API.updateBotWelcomeMessage(botId.toString(), message);

      setSnackbarMessage("Welcome message updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update welcome message:", error);
      setSnackbarMessage("Failed to update welcome message");
      setSnackbarOpen(true);
    }
  };

  const updateBotPrompt = async (botId: number, prompt: string) => {
    try {
      // Update local state immediately for responsive UI
      setSelectedBot(prev => prev ? { ...prev, prompt: prompt } : null);
      setPromptTemplate(prompt);

      // Update the users array
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === botId ? { ...user, prompt: prompt } : user
        )
      );

      // Call API to update the prompt
      await API.updateBotPrompt(botId.toString(), prompt);

      setSnackbarMessage("Prompt updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update prompt:", error);
      setSnackbarMessage("Failed to update prompt");
      setSnackbarOpen(true);
    }
  };

  const HtmlTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#ffffff",
      boxShadow: "0px 11px 15px rgba(0,0,0,0.2)",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  return (
    <Grid container className={className}>
      <Grid item xs={12} className="titleContainer">
        <Grid container justifyContent={"space-between"}>
          <Grid>
            <Grid item xs={12} sx={{ pb: 2 }}>
              <Typography variant="h2" sx={{ margin: "0px 10px 0px 0px" }}>
                Manage
              </Typography>
            </Grid>
          </Grid>
          <Grid item className={"userSetting"}>
            <>
              <IconButton
                onClick={() => setShowBox(true)}
                color="primary"
                sx={{ background: "#0f172a", padding: "8px", '&:hover': { background: "#1e293b" } }}
              >
                <BrowserUpdatedIcon sx={{ fill: "#fff" }} />
              </IconButton>
              <Copy
                text={`<script>document.addEventListener("DOMContentLoaded",function(){var w = window.innerWidth;var i=document.createElement("iframe");i.src="${APP_URL}/${(id ? filteredUsers : users)[0]?.tenant_uuid || (id || orgid)}/";i.style.position="absolute";i.style.bottom="0px";i.style.right="0px";i.style.zIndex="999";i.style.border="none";document.body.appendChild(i);const c=i.contentWindow;window.addEventListener("message",function(e){if(e.data.width&&e.data.height){w>=600?i.width=e.data.width:i.width='400px';i.height=e.data.height;}})});</script>`}
                showBox={showBox}
                setShowBox={setShowBox}
                copied={copied}
                setCopied={setCopied}
                copyError={copyError}
                setCopyError={setCopyError}
                handleCopy={handleCopy}
                handleCopyClose={handleCopyClose}
              />
              <IconButton
                color="primary"
                sx={{ background: "#0f172a", width: '100px', height: '40px', borderRadius: '20px', fontSize: '16px', color: 'white', marginLeft: "5px", '&:hover': { background: "#1e293b" } }}
                onClick={handleAdd}
              >
                <AddIcon sx={{ fill: "#fff" }} />
                Agent
              </IconButton>
              <AddUser
                open={openAddUser}
                containerData={containerData}
                id={String(id || orgid)}
                editMode={editMode}
                currentStep={currentStep}
                formDataStep1={formDataStep1}
                formDataStep2={formDataStep2}
                formDataStep3={formDataStep3}
                blobStorages={blobStorages}
                handleInputChangeStep1={handleInputChangeStep1}
                // @ts-ignore
                handleInputChangeStep2={handleInputChangeStep2}
                // @ts-ignore
                handleInputChangeStep3={handleInputChangeStep3}
                handleNext={handleNext}
                handleBack={handleBack}
                handleClose={handleClose}
                handleAddUser={handleAddUser}
                handleAddAzureStorage={handleAddAzureStorage}
              />
            </>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ width: "100%" }} className="customTabs">
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="scrollable auto tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Bot Management" {...a11yProps(0)} />
            <Tab label="Training Management" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Table
            headers={[
              "id",
              "Bot Name",
              "Container Name",
              "Created By",
              "Created Date",
              "",
            ]}
            data={(id ? filteredUsers : users)
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((user) => {
                const container = containerData.find(
                  (container) => container.id === user.container
                );
                const description = container ? container.name : containerst;
                return {
                  id: user.id,
                  botName: user.name,
                  containerName: description,
                  createdBy: user.created_by_name,
                  date: new Date(user.created_date).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "short", day: "numeric" }
                  ),
                };
              })}
            actions={[
              // "EDIT",
              "DELETE",
            ]}
            // handleEdit={handleEdit}
            handleDelete={handleDelete}
            searchRows={[]}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Box sx={{ p: 2 }}>
            {(id ? filteredUsers : users).length === 0 ? (
              <EmptyState title="No agents yet" description="Create your first agent to start automating conversations." />
            ) : (
              <Grid container spacing={2}>
                {(id ? filteredUsers : users)
                  .slice()
                  .sort((a, b) => b.id - a.id)
                  .map((user) => {
                    const container = containerData.find(c => c.id === user.container);
                    const containerHistory = (history || []).filter(h => h.container === user.container);
                    const lastRun = containerHistory[0] || null;
                    const recentRuns = containerHistory.slice(0, 6).reverse();
                    const isTraining = !!iconStates[user.id];

                    return (
                      <Grid item xs={12} md={6} lg={4} key={user.id}>
                        <Box sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 2,
                          p: 2.5,
                          bgcolor: '#fff',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          height: '100%',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                          transition: 'box-shadow 0.2s',
                          '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.10)' },
                        }}>
                          {/* Header row */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{
                              width: 44, height: 44, borderRadius: '50%',
                              bgcolor: user.color || 'primary.main',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
                                {user.name?.charAt(0)?.toUpperCase()}
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="subtitle1" fontWeight={700} noWrap>{user.name}</Typography>
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {container?.name || '—'}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={lastRun ? (lastRun.status === 'success' ? 'Trained' : 'Failed') : 'Untrained'}
                              color={lastRun ? (lastRun.status === 'success' ? 'success' : 'error') : 'default'}
                              sx={{ fontWeight: 600, fontSize: 11 }}
                            />
                          </Box>

                          {/* Training history dots */}
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                              Recent training runs
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                              {recentRuns.length === 0 ? (
                                <Typography variant="caption" color="text.disabled">No runs yet</Typography>
                              ) : recentRuns.map((run) => (
                                <HtmlTooltip
                                  key={run.id}
                                  title={
                                    <React.Fragment>
                                      <Typography variant="caption" display="block">{run.message}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(run.created_date).toLocaleString()}
                                      </Typography>
                                    </React.Fragment>
                                  }
                                >
                                  <Box sx={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    bgcolor: run.status === 'success' ? '#4caf50' : '#f44336',
                                    cursor: 'default',
                                  }} />
                                </HtmlTooltip>
                              ))}
                            </Box>
                            {lastRun && (
                              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                                Last run: {new Date(lastRun.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </Typography>
                            )}
                          </Box>

                          {/* Action buttons */}
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<FolderOpenIcon />}
                              onClick={() => handleOpenUploadDocument(user.id)}
                              sx={{ flex: 1 }}
                            >
                              Documents
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              startIcon={isTraining
                                ? <img src={loadingGif} alt="training" style={{ width: 16, height: 16 }} />
                                : <PlayCircleOutlineIcon />
                              }
                              onClick={() => handleIconClick(user.id)}
                              disabled={isTraining}
                              sx={{ flex: 1 }}
                            >
                              {isTraining ? 'Training…' : 'Train Bot'}
                            </Button>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<BrowserUpdatedIcon />}
                              onClick={() => handleCopyBot(user.container)}
                              sx={{ flex: 1, color: 'text.secondary' }}
                            >
                              Copy Script
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<SettingsIcon />}
                              onClick={() => handleGearClick(user)}
                              sx={{ flex: 1, color: 'text.secondary' }}
                            >
                              Settings
                            </Button>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => handleDelete(user.id)}
                              sx={{ color: 'error.main', minWidth: 0, px: 1 }}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
              </Grid>
            )}
          </Box>
        </CustomTabPanel>
      </Box>
      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 820,
            height: '90vh',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 2,
            overflow: 'hidden',
          }
        }}
      >
        {/* Left sidebar nav */}
        <Box sx={{
          width: 200,
          bgcolor: 'grey.50',
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          pt: 2,
          pb: 2,
          flexShrink: 0,
        }}>
          {/* Bot name header */}
          {selectedBot && (
            <Box sx={{ px: 2, pb: 2, mb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                bgcolor: selectedBot.color || 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mb: 1,
              }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                  {selectedBot.name?.charAt(0)?.toUpperCase()}
                </Typography>
              </Box>
              <Typography variant="subtitle2" fontWeight={700} noWrap>
                {selectedBot.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">Bot Settings</Typography>
            </Box>
          )}

          {/* Nav items */}
          {[
            { key: 'model',   icon: <ModelTrainingIcon fontSize="small" />, label: 'AI Model' },
            { key: 'welcome', icon: <ChatIcon fontSize="small" />,          label: 'Persona' },
            { key: 'media',   icon: <SettingsInputAntennaIcon fontSize="small" />, label: 'Media' },
            { key: 'calendly',icon: <ScheduleIcon fontSize="small" />,      label: 'Calendly' },
            { key: 'hubspot',     icon: <HubIcon fontSize="small" />,    label: 'HubSpot' },
            { key: 'custom_api',  icon: <ApiIcon fontSize="small" />,    label: 'Custom API' },
            { key: 'color',       icon: <PaletteIcon fontSize="small" />, label: 'Appearance' },
          ].map(({ key, icon, label }) => (
            <Box
              key={key}
              onClick={() => {
                setActiveSection(key);
                if (key === 'hubspot') setHubspotEnabled(selectedBot?.hubspot_enabled || false);
                if (key === 'custom_api') {
                  setCustomApiLoading(true);
                  API.getIntegrations().then(res => {
                    const integration = res.data.find((i: { type: string; enabled: boolean }) => i.type === 'custom_api' && i.enabled);
                    setCustomApiIntegration(integration || null);
                    if (integration) {
                      API.getEndpoints(integration.id).then(r => setCustomApiEndpoints(r.data)).catch(() => {});
                    } else {
                      setCustomApiEndpoints([]);
                    }
                  }).catch(() => {}).finally(() => setCustomApiLoading(false));
                }
              }}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                px: 2, py: 1.2, mx: 1, borderRadius: 1.5,
                cursor: 'pointer',
                bgcolor: activeSection === key ? 'primary.main' : 'transparent',
                color: activeSection === key ? '#fff' : 'text.primary',
                '&:hover': {
                  bgcolor: activeSection === key ? 'primary.main' : 'action.hover',
                },
                transition: 'background 0.15s',
              }}
            >
              {icon}
              <Typography variant="body2" fontWeight={activeSection === key ? 600 : 400}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Main content area */}
        {selectedBot && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{
              px: 3, py: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              borderBottom: '1px solid', borderColor: 'divider',
              flexShrink: 0,
            }}>
              <Typography variant="h6" fontWeight={700}>
                {{
                  model:    'AI Model',
                  welcome:  'Persona & Prompt',
                  media:    'Media Settings',
                  calendly: 'Calendly Integration',
                  hubspot:    'HubSpot CRM',
                  custom_api: 'Custom API',
                  color:      'Appearance',
                }[activeSection] || 'Settings'}
              </Typography>
              <IconButton size="small" onClick={() => setDrawerOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Scrollable content */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 3 }}>

              {/* Model section */}
              {activeSection === 'model' && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose the AI model that powers this bot. More capable models produce better responses but may cost more.
                  </Typography>
                  <FormControl fullWidth size="small">
                    <InputLabel>AI Model</InputLabel>
                    <Select
                      value={selectedBot?.model || selectedBot?.default_model || "gpt-4o-mini"}
                      label="AI Model"
                      onChange={(e) => {
                        const newModel = e.target.value as string;
                        if (selectedBot) {
                          updateBotModel(selectedBot.id, newModel);
                        }
                      }}
                    >
                      {availableModels.map(model => (
                        <MenuItem key={model} value={model}>
                          {model}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Welcome + Prompt section */}
              {activeSection === 'welcome' && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Set your bot's opening message and system prompt that defines its personality and behavior.
                  </Typography>

                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Welcome Message
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    placeholder="Hi! How can I help you today?"
                    variant="outlined"
                    size="small"
                  />
                  {selectedBot?.welcome_message !== welcomeMessage && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="contained" size="small"
                        onClick={() => updateBotWelcomeMessage(selectedBot.id, welcomeMessage)}>
                        Save
                      </Button>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    System Prompt
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                    Defines the bot's persona, tone, and behavior rules.
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    placeholder="You are a helpful assistant for..."
                    variant="outlined"
                    size="small"
                  />
                  {selectedBot?.prompt !== promptTemplate && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="contained" size="small"
                        onClick={() => updateBotPrompt(selectedBot.id, promptTemplate)}>
                        Save
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {/* Media section */}
              {activeSection === 'media' && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose which input/output modes this bot supports.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      onClick={() => {
                        const cur = selectedBot?.media_type || 'both';
                        const next = cur === 'audio' ? 'both' : cur === 'text' ? 'text' : 'text';
                        setSelectedBot(prev => prev ? { ...prev, media_type: next } : null);
                        updateBotMediaType(selectedBot.id, next);
                        setUsers(prev => prev.map(u => u.id === selectedBot.id ? { ...u, media_type: next } : u));
                      }}
                      sx={{
                        flex: 1, p: 2.5, borderRadius: 2, cursor: 'pointer',
                        border: '2px solid',
                        borderColor: (selectedBot?.media_type === 'both' || selectedBot?.media_type === 'text') ? 'primary.main' : 'divider',
                        bgcolor: (selectedBot?.media_type === 'both' || selectedBot?.media_type === 'text') ? 'primary.50' : 'background.paper',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                        transition: 'all 0.15s',
                      }}
                    >
                      <TextSnippetIcon color={(selectedBot?.media_type === 'both' || selectedBot?.media_type === 'text') ? 'primary' : 'action'} />
                      <Typography variant="body2" fontWeight={600}>Text</Typography>
                      <Typography variant="caption" color="text.secondary" textAlign="center">Chat messages and typed input</Typography>
                    </Box>
                    <Box
                      onClick={() => {
                        const cur = selectedBot?.media_type || 'both';
                        const next = cur === 'text' ? 'both' : cur === 'audio' ? 'audio' : 'audio';
                        setSelectedBot(prev => prev ? { ...prev, media_type: next } : null);
                        updateBotMediaType(selectedBot.id, next);
                        setUsers(prev => prev.map(u => u.id === selectedBot.id ? { ...u, media_type: next } : u));
                      }}
                      sx={{
                        flex: 1, p: 2.5, borderRadius: 2, cursor: 'pointer',
                        border: '2px solid',
                        borderColor: (selectedBot?.media_type === 'both' || selectedBot?.media_type === 'audio') ? 'primary.main' : 'divider',
                        bgcolor: (selectedBot?.media_type === 'both' || selectedBot?.media_type === 'audio') ? 'primary.50' : 'background.paper',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                        transition: 'all 0.15s',
                      }}
                    >
                      <AudioFileIcon color={(selectedBot?.media_type === 'both' || selectedBot?.media_type === 'audio') ? 'primary' : 'action'} />
                      <Typography variant="body2" fontWeight={600}>Audio</Typography>
                      <Typography variant="caption" color="text.secondary" textAlign="center">Voice input and speech output</Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Calendly section */}
              {activeSection === 'calendly' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>Calendly Scheduling</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    When enabled, users who ask to book a meeting will see your Calendly embed inline in the chat. Configure your Calendly URL on the <strong>Integrations</strong> page first.
                  </Typography>
                  <Box sx={{
                    p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    bgcolor: calendlyEnabled ? 'success.50' : 'background.paper',
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>Enable for this bot</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {calendlyEnabled ? 'Active — scheduling requests will show the Calendly widget' : 'Disabled'}
                      </Typography>
                    </Box>
                    <Switch
                      checked={calendlyEnabled}
                      onChange={(e) => setCalendlyEnabled(e.target.checked)}
                      color="success"
                    />
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={updateBotCalendlySettings}>
                      Save Settings
                    </Button>
                  </Box>
                </Box>
              )}

              {/* HubSpot section */}
              {activeSection === 'hubspot' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HubIcon color="warning" />
                    <Typography variant="subtitle1" fontWeight={700}>HubSpot CRM</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    When enabled, the bot will automatically create contacts and deals in HubSpot from conversations. Configure your API key on the <strong>Integrations</strong> page first.
                  </Typography>
                  <Box sx={{
                    p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    bgcolor: hubspotEnabled ? 'warning.50' : 'background.paper',
                  }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>Enable for this bot</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {hubspotEnabled ? 'Active — contacts and deals will be created automatically' : 'Disabled'}
                      </Typography>
                    </Box>
                    <Switch
                      checked={hubspotEnabled}
                      onChange={(e) => setHubspotEnabled(e.target.checked)}
                      color="warning"
                    />
                  </Box>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button variant="contained" onClick={async () => {
                      if (!selectedBot) return;
                      try {
                        await API.updateBotHubspotEnabled(selectedBot.id.toString(), hubspotEnabled);
                        setSnackbarMessage("HubSpot settings saved");
                        setSnackbarOpen(true);
                      } catch {
                        setSnackbarMessage("Failed to save HubSpot settings");
                        setSnackbarOpen(true);
                      }
                    }}>
                      Save Settings
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Custom API section */}
              {activeSection === 'custom_api' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ApiIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>Custom API</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    When a Custom API integration is configured, this bot can call your registered endpoints to answer queries from your internal systems.
                    Set up your API on the <strong>Integrations</strong> page first.
                  </Typography>

                  {customApiLoading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                  ) : !customApiIntegration ? (
                    <Box sx={{
                      p: 3, borderRadius: 2, border: '1px dashed', borderColor: 'divider',
                      textAlign: 'center',
                    }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        No Custom API integration configured yet.
                      </Typography>
                      <Button variant="outlined" size="small" onClick={() => { setDrawerOpen(false); window.location.href = '/integrations'; }}>
                        Go to Integrations
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{
                        p: 2, borderRadius: 2, border: '1px solid', borderColor: 'success.light',
                        bgcolor: 'success.50', display: 'flex', alignItems: 'center', gap: 1.5, mb: 3,
                      }}>
                        <Chip label="Connected" color="success" size="small" />
                        <Typography variant="body2">
                          <strong>{customApiIntegration.config?.base_url}</strong>
                        </Typography>
                      </Box>

                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                        Registered Endpoints ({customApiEndpoints.length})
                      </Typography>

                      {customApiEndpoints.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No endpoints registered. Add endpoints on the Integrations page.
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {customApiEndpoints.map(ep => (
                            <Box key={ep.id} sx={{
                              p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider',
                              display: 'flex', alignItems: 'flex-start', gap: 1.5,
                            }}>
                              <Chip
                                label={ep.method}
                                size="small"
                                color={
                                  ep.method === 'GET' ? 'success' :
                                  ep.method === 'POST' ? 'primary' :
                                  ep.method === 'DELETE' ? 'error' : 'warning'
                                }
                                sx={{ mt: 0.25, minWidth: 56, fontFamily: 'monospace', fontWeight: 700 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight={600}>{ep.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                                  {ep.path}
                                </Typography>
                                {ep.description && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {ep.description}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Button size="small" variant="text" onClick={() => { setDrawerOpen(false); window.location.href = '/integrations'; }}>
                          Manage endpoints →
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              )}

              {/* Appearance section */}
              {activeSection === 'color' && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Customize the bot widget's color, font, and typography.
                  </Typography>

                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Color Theme</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 60, height: 60, borderRadius: 2,
                        bgcolor: selectedBot?.color || botColor,
                        cursor: 'pointer', border: '2px solid', borderColor: 'divider',
                        flexShrink: 0,
                      }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Click swatch to open picker</Typography>
                      <TextField
                        value={selectedBot?.color || botColor}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^#[0-9A-F]{6}$/i.test(v)) updateBotColor(selectedBot.id, v);
                        }}
                        size="small"
                        sx={{ width: 120, display: 'block', mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  {showColorPicker && (
                    <Box sx={{ mb: 3 }}>
                      <ChromePicker
                        color={selectedBot?.color || botColor}
                        onChangeComplete={(color) => updateBotColor(selectedBot.id, color.hex)}
                      />
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Typography</Typography>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Font Family</InputLabel>
                    <Select
                      value={selectedBot?.font || 'Arial'}
                      label="Font Family"
                      onChange={(e) => selectedBot && updateBotFont(selectedBot.id, e.target.value as string)}
                      renderValue={(v) => <span style={{ fontFamily: v as string }}>{v}</span>}
                    >
                      {availableFonts.map(font => (
                        <MenuItem key={font} value={font} style={{ fontFamily: font }}>{font}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Style</InputLabel>
                        <Select
                          value={selectedBot?.font_style || 'normal'}
                          label="Style"
                          onChange={(e) => selectedBot && updateBotFontStyle(selectedBot.id, e.target.value as string)}
                        >
                          <MenuItem value="normal">Normal</MenuItem>
                          <MenuItem value="italic">Italic</MenuItem>
                          <MenuItem value="bold">Bold</MenuItem>
                          <MenuItem value="bold italic">Bold Italic</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Size</InputLabel>
                        <Select
                          value={selectedBot?.font_size || '16px'}
                          label="Size"
                          onChange={(e) => selectedBot && updateBotFontSize(selectedBot.id, e.target.value as string)}
                        >
                          {[10, 12, 14, 16, 18, 20, 22, 24].map(s => (
                            <MenuItem key={s} value={`${s}px`}>{s}px</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography style={{
                      fontFamily: selectedBot?.font || 'Arial',
                      fontStyle: selectedBot?.font_style?.includes('italic') ? 'italic' : 'normal',
                      fontWeight: selectedBot?.font_style?.includes('bold') ? 'bold' : 'normal',
                      fontSize: selectedBot?.font_size || '16px',
                    }}>
                      Preview: The quick brown fox jumps over the lazy dog
                    </Typography>
                  </Box>
                </Box>
              )}

            </Box>
          </Box>
        )}
      </Dialog>
      {uploadingLoading && (
        <Grid
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        >
          <CircularProgress
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </Grid>
      )}
      {openUploadDocument && (
        <DataSources
          open={openUploadDocument}
          onClose={handleCloseUploadDocument}
          botId={selectedUserId}
          tenantId={id ? parseInt(id) : orgid}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          file={file}
          fileLoading={loading}
          handelFileDelete={handelFileDelete}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      )}
      {openBotCopy && (
        <Copy
          open={openBotCopy}
          text={(() => { const bot = users.find(u => u.container === selectedUserId); return `<script>(function(){var _q=[];var _iframe=null;window.sapleBot=function(cmd,data){if(_iframe&&_iframe.contentWindow){_iframe.contentWindow.postMessage(Object.assign({type:"saple:"+cmd},data),"*");}else{_q.push([cmd,data]);}};function initSapleBot(){var w=window.innerWidth;_iframe=document.createElement("iframe");_iframe.src="${APP_URL}/${bot?.tenant_uuid || (id || orgid)}/${bot?.uuid || selectedUserId}";_iframe.style.position="fixed";_iframe.style.bottom="0px";_iframe.style.right="0px";_iframe.style.width="100px";_iframe.style.height="100px";_iframe.style.zIndex="999";_iframe.style.border="none";_iframe.style.background="transparent";_iframe.setAttribute("allowtransparency","true");document.body.appendChild(_iframe);window.addEventListener("message",function(e){if(e.data.type==="saple:ready"){_q.forEach(function(item){_iframe.contentWindow.postMessage(Object.assign({type:"saple:"+item[0]},item[1]),"*");});_q=[];}if(e.data.width&&e.data.height){_iframe.style.width=w>=600?e.data.width:\"400px\";_iframe.style.height=e.data.height;}});}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initSapleBot);}else{initSapleBot();}})();</script>`; })()}
          showBox={showBox}
          setShowBox={setShowBox}
          copied={copied}
          setCopied={setCopied}
          copyError={copyError}
          setCopyError={setCopyError}
          handleCopy={handleCopy}
          handleCopyClose={handleCopyClose}
        />
      )}
      {selectedBot && (
        <Modal
          open={openCalendly}
          onClose={handleCloseCalendly}
          aria-labelledby="calendly-modal-title"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1
          }}>
            <Typography variant="h6" gutterBottom>
              Calendly Integration for {selectedBot.name}
            </Typography>

            <TextField
              fullWidth
              label="Calendly Link"
              value={calendlyLink}
              onChange={(e) => {
                setCalendlyLink(e.target.value);
                setCalendlyError("");
              }}
              placeholder="https://calendly.com/your-username"
              variant="outlined"
              size="small"
              sx={{ mb: 2 }}
              error={!!calendlyError}
              helperText={calendlyError || "Enter your full Calendly URL"}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={calendlyEnabled}
                  onChange={(e) => {
                    const enabled = e.target.checked;
                    if (enabled && !isValidCalendlyLink(calendlyLink)) {
                      setCalendlyError("Please enter a valid Calendly link first");
                      return;
                    }
                    setCalendlyEnabled(enabled);
                  }}
                  color="primary"
                />
              }
              label="Enable Calendly Integration"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleCloseCalendly}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={updateBotCalendlySettings}
                disabled={calendlyEnabled && !isValidCalendlyLink(calendlyLink)}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
      <Confirmation
        ConfirmationOpen={ConfirmationOpen}
        setConfirmationOpen={setConfirmationOpen}
        handleDeleteConfirmed={handleDeleteConfirmed}
        handleEditConfirmed={handleEditConfirmed}
        deletion={deletion!}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Grid>
  );
}

export default styled(User)(style);
