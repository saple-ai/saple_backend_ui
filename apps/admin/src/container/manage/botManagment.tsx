import React, { useState, useEffect } from "react";
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
import UploadDocument from "./components/uplodDocument";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Add as AddIcon } from "@mui/icons-material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import loadingGif from "../../assets/gif/loading.gif";
import Brightness1RoundedIcon from "@mui/icons-material/Brightness1Rounded";
import API from "../../utils/api";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Confirmation from "../confirmationDialog/index";
import { BrowserUpdated as BrowserUpdatedIcon } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { Checkbox } from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Drawer from "@mui/material/Drawer";
import SettingsIcon from "@mui/icons-material/Settings";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { ChromePicker } from "react-color";
import ScheduleIcon from '@mui/icons-material/Schedule';
import FormControlLabel from '@mui/material/FormControlLabel';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import ChatIcon from '@mui/icons-material/Chat';
// import DescriptionIcon from '@mui/icons-material/Description';
import PaletteIcon from '@mui/icons-material/Palette';
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
    "gemini-2.5-pro-preview-06-05",
    "claude-opus-4-20250514",
    "gemini-2.5-pro-preview-05-06",
    "claude-sonnet-4-20250514",
    "claude-3-7-sonnet-20250219",
    "gemini-2.5-flash-preview-05-20",
    "gpt-4o-mini",
    "claude-3-5-sonnet-20241022",
    "gemini-2.0-flash"
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

    // Validate link if enabling Calendly
    if (calendlyEnabled && !isValidCalendlyLink(calendlyLink)) {
      setCalendlyError("Please enter a valid Calendly URL (e.g., https://calendly.com/yourname)");
      return;
    }

    try {
      // Update Calendly link if changed
      if (selectedBot.calendly_link !== calendlyLink) {
        await API.updateBotCalendlyLink(
          selectedBot.id.toString(),
          calendlyEnabled ? calendlyLink : ""
        );
      }

      // Update enabled status if changed
      if (selectedBot.calendly_enabled !== calendlyEnabled) {
        await API.updateBotCalendlyEnabled(
          selectedBot.id.toString(),
          calendlyEnabled
        );
      }

      // Update local state
      setUsers(users.map(user =>
        user.id === selectedBot.id
          ? {
            ...user,
            calendlyEnabled,
            calendly_link: calendlyEnabled ? calendlyLink : null
          }
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
            <Grid item xs={12} sx={{ pb: 1 }}>
              <Breadcrumbs separator="››" aria-label="breadcrumb">
                <Links underline="hover" color="blue" href="/dashboard">
                  Home
                </Links>
                <Links underline="hover" color="blue" href="/manage">
                  Manage
                </Links>
                <Typography color="text.primary">{management}</Typography>
              </Breadcrumbs>
            </Grid>
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
                sx={{ background: "#004D6C", padding: "8px" }}
              >
                <BrowserUpdatedIcon sx={{ fill: "#fff" }} />
              </IconButton>
              <Copy
                text={`<script>document.addEventListener("DOMContentLoaded",function(){var w = window.innerWidth;var i=document.createElement("iframe");i.src="${APP_URL}/${id ? id : orgid}/";i.style.position="absolute";i.style.bottom="0px";i.style.right="0px";i.style.zIndex="999";i.style.border="none";document.body.appendChild(i);const c=i.contentWindow;window.addEventListener("message",function(e){if(e.data.width&&e.data.height){w>=600?i.width=e.data.width:i.width='400px';i.height=e.data.height;}})});</script>`}
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
                sx={{ background: "#004D6C", width: '100px', height: '40px', borderRadius: '20px', fontSize: '16px', color: 'white', marginLeft: "5px" }}
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
            searchRows={[0, 1, 2, 3]}
          />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Table
            headers={[
              "id",
              "Bot Name",
              "Container Name",
              "Upload Document",
              "Trigger",
              "Status",
              "Embeddable Script",
              "Settings",
              "Actions",
              "",
            ]}
            data={(id ? filteredUsers : users)
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((user) => {
                const container = containerData.find(
                  (container) => container.id === user.container
                );
                const containerHistory = history!.filter(
                  (historyItem) => historyItem.container === user.container
                );
                const lastFiveStatuses = containerHistory.slice(0, 5).reverse();
                const lastFiveStatusIcons = lastFiveStatuses.map((status) => (
                  <HtmlTooltip
                    key={status.id}
                    title={
                      <React.Fragment>
                        <Typography color="inherit">
                          {status.message}
                        </Typography>
                        <b>{new Date(status.created_date).toLocaleString()}</b>
                      </React.Fragment>
                    }
                  >
                    <Brightness1RoundedIcon
                      style={{
                        color: status.status === "success" ? "green" : "red",
                      }}
                    />
                  </HtmlTooltip>
                ));
                const description = container ? container.name : containerst;

                return {
                  id: user.id,
                  botName: user.name,
                  containerName: description,
                  discription: (
                    <FolderOpenIcon
                      onClick={() => handleOpenUploadDocument(user.id)}
                    />
                  ),
                  icon: iconStates[user.id] ? (
                    <img
                      src={loadingGif}
                      alt="loading"
                      style={{ width: "20px", height: "20px" }}
                    />
                  ) : (
                    <PlayCircleOutlineIcon
                      onClick={() => handleIconClick(user.id)}
                    />
                  ),
                  airflow: lastFiveStatusIcons,
                  bot: (
                    <BrowserUpdatedIcon
                      onClick={() => handleCopyBot(user.container)}
                    />
                  ),
                  // calendly: (
                  //   <IconButton onClick={() => handleOpenCalendly(user)}>
                  //     <ScheduleIcon color={user.calendly_enabled ? "primary" : "inherit"} />
                  //   </IconButton>
                  // ),

                  actions: (
                    <SettingsIcon
                      onClick={() => handleGearClick(user)}
                      sx={{ cursor: "pointer" }}
                    />
                  ),
                };
              })}
            actions={["DELETE"]}
            handleDelete={handleDelete}
            searchRows={[0, 1, 2]}
          />
        </CustomTabPanel>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 400, // Increased width to accommodate navbar
            display: "flex",
            flexDirection: "row",
            padding: 0,
          },
        }}
      >
        {/* Left Navbar */}
        <Box
          sx={{
            width: 80,
            bgcolor: "#f5f5f5",
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 2,
          }}
        >
          <IconButton
            sx={{ mb: 3, color: activeSection === 'media' ? 'primary.main' : 'inherit' }}
            onClick={() => setActiveSection('media')}
            title="Media Settings"
          >
            <SettingsInputAntennaIcon />
          </IconButton>

          <IconButton
            sx={{ mb: 3, color: activeSection === 'model' ? 'primary.main' : 'inherit' }}
            onClick={() => setActiveSection('model')}
            title="Model Selection"
          >
            <ModelTrainingIcon />
          </IconButton>

          <IconButton
            sx={{ mb: 3, color: activeSection === 'welcome' ? 'primary.main' : 'inherit' }}
            onClick={() => setActiveSection('welcome')}
            title="Welcome Message"
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            sx={{ mb: 3, color: activeSection === 'calendly' ? 'primary.main' : 'inherit' }}
            onClick={() => setActiveSection('calendly')}
            title="Calendly Integration"
          >
            <ScheduleIcon />
          </IconButton>

          {/* <IconButton
            sx={{ mb: 3, color: activeSection === 'prompt' ? 'primary.main' : 'inherit' }}
            onClick={() => setActiveSection('prompt')}
            title="Prompt Template"
          >
            <DescriptionIcon />
          </IconButton> */}

          <IconButton
            sx={{ mb: 3, color: activeSection === 'color' ? 'primary.main' : 'inherit' }}
            onClick={() => setActiveSection('color')}
            title="Color Theme"
          >
            <PaletteIcon />
          </IconButton>
        </Box>

        {/* Content Area */}
        {selectedBot && (
          <Box sx={{
            flex: 1,
            padding: "20px",
            overflowY: 'auto',
            maxHeight: '100%',
          }}>
            <Typography variant="h1" gutterBottom sx={{ marginBottom: '25px' }}>
              Bot Settings: {selectedBot.name}
            </Typography>

            {/* Conditionally render sections based on activeSection */}
            {activeSection === 'media' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Audio/Text
                </Typography>
                <Grid
                  container
                  flexDirection="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={0}
                >
                  <Grid
                    item
                    xs={6}
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="column"
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={
                          selectedBot?.media_type === "both" ||
                          selectedBot?.media_type === "text"
                        }
                        onChange={(e) => {
                          const currentMediaType =
                            selectedBot?.media_type || "both";
                          const newMediaType = e.target.checked
                            ? currentMediaType === "audio"
                              ? "both"
                              : "text"
                            : currentMediaType === "both"
                              ? "audio"
                              : "text";

                          setSelectedBot((prev) =>
                            prev
                              ? {
                                ...prev,
                                media_type: newMediaType,
                              }
                              : null
                          );

                          updateBotMediaType(selectedBot.id, newMediaType);

                          setUsers((prevUsers) =>
                            prevUsers.map((user) =>
                              user.id === selectedBot.id
                                ? { ...user, media_type: newMediaType }
                                : user
                            )
                          );
                        }}
                      />
                      <Typography variant="body2">Text</Typography>
                      <TextSnippetIcon sx={{ marginLeft: 1 }} />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    direction="column"
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Checkbox
                        checked={
                          selectedBot?.media_type === "both" ||
                          selectedBot?.media_type === "audio"
                        }
                        onChange={(e) => {
                          const currentMediaType =
                            selectedBot?.media_type || "both";
                          const newMediaType = e.target.checked
                            ? currentMediaType === "text"
                              ? "both"
                              : "audio"
                            : currentMediaType === "both"
                              ? "text"
                              : "audio";

                          setSelectedBot((prev) =>
                            prev
                              ? {
                                ...prev,
                                media_type: newMediaType,
                              }
                              : null
                          );

                          updateBotMediaType(selectedBot.id, newMediaType);

                          setUsers((prevUsers) =>
                            prevUsers.map((user) =>
                              user.id === selectedBot.id
                                ? { ...user, media_type: newMediaType }
                                : user
                            )
                          );
                        }}
                      />
                      <Typography variant="body2">Audio</Typography>
                      <AudioFileIcon sx={{ marginLeft: 1 }} />
                    </div>
                  </Grid>
                </Grid>
              </Box>
            )}

            {activeSection === 'model' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Model Selection
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

            {activeSection === 'welcome' && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Welcome Message
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    value={welcomeMessage}
                    onChange={(e) => {
                      setWelcomeMessage(e.target.value);
                    }}
                    placeholder="Enter welcome message..."
                    variant="outlined"
                  />
                  {selectedBot?.welcome_message !== welcomeMessage && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => updateBotWelcomeMessage(selectedBot.id, welcomeMessage)}
                      >
                        Save Welcome Message
                      </Button>
                    </Box>
                  )}
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Prompt Template
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={14}
                    value={promptTemplate}
                    onChange={(e) => {
                      setPromptTemplate(e.target.value);
                    }}
                    placeholder="Enter your custom prompt template..."
                    variant="outlined"
                  />
                  {selectedBot?.prompt !== promptTemplate && (
                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => updateBotPrompt(selectedBot.id, promptTemplate)}
                      >
                        Save Prompt
                      </Button>
                    </Box>
                  )}
                </Box>
              </>
            )}

            {/* {activeSection === 'prompt' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Prompt Template
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={promptTemplate}
                  onChange={(e) => {
                    setPromptTemplate(e.target.value);
                  }}
                  placeholder="Enter your custom prompt template..."
                  variant="outlined"
                />
                {selectedBot?.prompt !== promptTemplate && (
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => updateBotPrompt(selectedBot.id, promptTemplate)}
                    >
                      Save Prompt
                    </Button>
                  </Box>
                )}
              </Box>
            )} */}
            {/* Calendly Integration Section */}
            {activeSection === 'calendly' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Calendly Integration
                </Typography>

                <TextField
                  fullWidth
                  label="Calendly Link"
                  value={calendlyLink}
                  onChange={(e) => setCalendlyLink(e.target.value)}
                  placeholder="https://calendly.com/your-username"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                  error={calendlyEnabled && !isValidCalendlyLink(calendlyLink)}
                  helperText={calendlyEnabled && !isValidCalendlyLink(calendlyLink)
                    ? "Please enter a valid Calendly URL"
                    : "Enter your full Calendly URL"}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={calendlyEnabled}
                      onChange={(e) => {
                        const enabled = e.target.checked;
                        if (enabled && !isValidCalendlyLink(calendlyLink)) {
                          setSnackbarMessage("Please enter a valid Calendly URL first");
                          setSnackbarOpen(true);
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

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={updateBotCalendlySettings}
                    disabled={calendlyEnabled && !isValidCalendlyLink(calendlyLink)}
                  >
                    Save Settings
                  </Button>
                </Box>
              </Box>
            )}

            {activeSection === 'color' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Bot Color Theme
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: 250,
                      height: 150,
                      backgroundColor: selectedBot?.color || botColor,
                      borderRadius: 4,
                      cursor: "pointer",
                      border: "1px solid #ccc",
                      marginTop: "25px"
                    }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  />
                  <TextField
                    value={selectedBot?.color || botColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                        updateBotColor(selectedBot.id, newColor);
                      }
                    }}
                    size="small"
                    sx={{ width: 120 }}
                  />
                </div>
                {showColorPicker && (
                  <div style={{ marginTop: 16 }}>
                    <ChromePicker
                      color={selectedBot?.color || botColor}
                      onChangeComplete={(color) => {
                        const hexColor = color.hex;
                        updateBotColor(selectedBot.id, hexColor);
                      }}
                    />
                  </div>
                )}

                <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                  Font Selection
                </Typography>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Font Family</InputLabel>
                  <Select
                    value={selectedBot?.font || 'Arial'}
                    label="Font Family"
                    onChange={(e) => {
                      const newFont = e.target.value as string;
                      if (selectedBot) {
                        updateBotFont(selectedBot.id, newFont);
                      }
                    }}
                    renderValue={(selected) => (
                      <div style={{ fontFamily: selected as string }}>
                        {selected}
                      </div>
                    )}
                  >
                    {availableFonts.map(font => (
                      <MenuItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Font Style</InputLabel>
                      <Select
                        value={selectedBot?.font_style || 'normal'}
                        label="Font Style"
                        onChange={(e) => {
                          const newStyle = e.target.value as string;
                          if (selectedBot) {
                            updateBotFontStyle(selectedBot.id, newStyle);
                          }
                        }}
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
                      <InputLabel>Font Size</InputLabel>
                      <Select
                        value={selectedBot?.font_size || '16px'}
                        label="Font Size"
                        onChange={(e) => {
                          const newSize = e.target.value as string;
                          if (selectedBot) {
                            updateBotFontSize(selectedBot.id, newSize);
                          }
                        }}
                      >
                        {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map(size => (
                          <MenuItem key={size} value={`${size}px`}>
                            {size}px
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                  <Typography
                    variant="body1"
                    style={{
                      fontFamily: selectedBot?.font || 'Arial',
                      fontStyle: selectedBot?.font_style?.includes('italic') ? 'italic' : 'normal',
                      fontWeight: selectedBot?.font_style?.includes('bold') ? 'bold' : 'normal',
                      fontSize: selectedBot?.font_size || '16px'
                    }}
                  >
                    Qwertyuiop Asdfghjkl Zxcvbnm
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: selectedBot?.font || 'Arial',
                      fontStyle: selectedBot?.font_style?.includes('italic') ? 'italic' : 'normal',
                      fontWeight: selectedBot?.font_style?.includes('bold') ? 'bold' : 'normal',
                      fontSize: selectedBot?.font_size || '16px'
                    }}
                  >
                    1234567890 !@#$%^&*()
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Drawer>
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
        <UploadDocument
          open={openUploadDocument}
          onClose={handleCloseUploadDocument}
          userId={selectedUserId}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          handleDocClose={handleDocClose}
          file={file}
          selectedUserId={selectedUserId}
          loading={loading}
          handelFileDelete={handelFileDelete}
        />
      )}
      {openBotCopy && (
        <Copy
          open={openBotCopy}
          text={`<script>document.addEventListener("DOMContentLoaded",function(){var w = window.innerWidth;var i=document.createElement("iframe");i.src="${APP_URL}/${id ? id : orgid}/${selectedUserId}";i.style.position="fixed";i.style.bottom="0px";i.style.right="0px";i.style.zIndex="999";i.style.border="none";document.body.appendChild(i);const c=i.contentWindow;window.addEventListener("message",function(e){if(e.data.width&&e.data.height){w>=600?i.width=e.data.width:i.width='400px';i.height=e.data.height;}})});</script>`}
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
