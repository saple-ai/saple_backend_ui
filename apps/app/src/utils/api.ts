import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { TrainingResult } from './types';

const API_URL: string = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/';
const TOKEN_KEY: string = 'token';
const REFRESH_TOKEN_KEY: string = 'refresh_token';

interface TenantData {
  name: string;
  domain: string;
  email: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
}

interface BotData {
  name?: string;
  blob_storage?: string;
  container?: string;
  tenant?: string;
}

interface BlobStorageData {
  account_name: string;
  account_key: string;
  tenant: string;
}

interface BlobContainerData {
  name: string;
  blob_storage: string;
  tenant: string;
}

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_URL,
    timeout: 120000, // 2 minutes (120 seconds * 1000 milliseconds)
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const requestUrl = String(config.url || '');
      const isAuthFreeEndpoint =
        requestUrl.includes('login/') ||
        requestUrl.includes('register/') ||
        requestUrl.includes('token/') ||
        requestUrl.includes('logout/');
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && !isAuthFreeEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      // @ts-ignore
      if (error.response?.status === 401 && !originalRequest?._retry) {
        // @ts-ignore
        originalRequest!._retry = true;
        try {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
          const response = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
          const { access } = response.data;

          localStorage.setItem(TOKEN_KEY, access);

          if (originalRequest?.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }

          return instance(originalRequest!);
        } catch (refreshError) {
          // Handle refresh token failure
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const axiosInstance = createAxiosInstance();

const API = {
  async login(username: string, password: string): Promise<AxiosResponse> {
    const response = await axiosInstance.post('login/', { username, password });
    const { access, refresh } = response.data;
    // Store tokens in localStorage
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    return response;
  },

  async logout(): Promise<AxiosResponse> {
    try {
      const response = await axiosInstance.post('logout/', {
        refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY)
      });
      // Clear tokens from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.location.href = '/';
      return response;
    } catch (error) {
      // Even if logout fails, clear tokens
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      window.location.href = '/';
      throw error;
    }
  },

  activebot(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/messages/');
  },

  activesection(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/activesection/');
  },

  superadminregister(username: string, password: string, email: string, phone: string): Promise<AxiosResponse> {
    return axiosInstance.post('register/', { username, password, email, phone });
  },

  superadminedit(id: string, username: string, password: string, email: string, phone: string): Promise<AxiosResponse> {
    return axiosInstance.put(`edit/${id}/`, { username, password, email, phone });
  },

  superadmindelete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`delete/${id}/`);
  },

  superadminuserview(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/superadmin/users/');
  },

  tenants(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/tenants/');
  },

  tenantsPost(name: string, domain: string, email: string, contact_person_name: string, contact_person_email: string, contact_person_phone: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/tenants/', { name, domain, email, contact_person_name, contact_person_email, contact_person_phone });
  },

  tenantsUpdate(id: string, updatedData: Partial<TenantData>): Promise<AxiosResponse> {
    return axiosInstance.put(`admin/tenants/${id}/`, updatedData);
  },

  tenantsDelete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/tenants/${id}/`);
  },

  users(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/users/');
  },

  userspost(username: string, password: string, email: string, phone: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/users/', { username, password, email, phone });
  },

  userstenatpost(username: string, password: string, email: string, tenant: string, phone: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/users/', { username, password, email, tenant, phone });
  },

  usersUpdate(id: string, username: string, password: string, email: string, phone: string): Promise<AxiosResponse> {
    return axiosInstance.put(`admin/users/${id}/`, { username, password, email, phone });
  },

  usersDelete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/users/${id}/`);
  },

  blobStorage(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/blob-storage/');
  },

  blobStoragePost(account_name: string, account_key: string, tenant?: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/blob-storage/', { account_name, account_key, tenant });
  },

  blobStorageUpdate(id: string, updatedData: Partial<BlobStorageData>): Promise<AxiosResponse> {
    return axiosInstance.put(`admin/blob-storage/${id}/`, updatedData);
  },

  blobStorageDelete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/blob-storage/${id}/`);
  },

  blobsContainers(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/blobs/containers/');
  },

  blobsContainersusers(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/blobsuser/containers/');
  },

  blobsContainerspost(name: string, blob_storage: string, tenant: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/blobs/containers/', { name, blob_storage, tenant });
  },

  blobsContainersUpdate(id: string, updatedData: Partial<BlobContainerData>): Promise<AxiosResponse> {
    return axiosInstance.put(`admin/blobs/containers/${id}/`, updatedData);
  },

  blobsContainersDelete(id: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/blobs/containers/${id}/`);
  },

  blobsFiles(id: string): Promise<AxiosResponse> {
    return axiosInstance.get(`blob-containers/${id}/files/`);
  },

  blobsFilespost(formData: FormData, container: string, tenant: string, blob_storage: string, bot: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/blobs/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { container, tenant, blob_storage, bot }
    });
  },

  blobsFilesDelete(id: string, filename: string): Promise<AxiosResponse> {
    return axiosInstance.delete(`blob-containers/${id}/files/${filename}/`, { params: { filename } });
  },

  bots(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/bots/');
  },

  botspost(botData: BotData): Promise<AxiosResponse> {
    return axiosInstance.post('admin/bots/', botData);
  },

  botsUpdate(id: string, name: string, blob_storage: string, container: string, tenant: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${id}/`, { name, blob_storage, container, tenant });
  },

  botsDelete: (id: string) => axiosInstance.delete(`admin/bots/${id}/`),

  updateBotMediaType(botId: string, mediaType: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { media_type: mediaType });
  },

  updateBotColor(botId: string, color: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { color });
  },

  updateBotFont(botId: string, font: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { font });
  },

  updateBotFontSize(botId: string, font_size: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { font_size });
  },

  updateBotFontStyle(botId: string, font_style: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { font_style });
  },

  updateBotModel(botId: string, model: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { "default_model": model });
  },

  updateBotWelcomeMessage(botId: string, message: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { "welcome_message": message });
  },

  updateBotPrompt(botId: string, prompt: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { "prompt": prompt });
  },

  filesAndContainers(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/files_and_containers/');
  },

  traininghistory(training: TrainingResult): Promise<AxiosResponse> {
    return axiosInstance.post('admin/traininghistory/', training);
  },

  traininghistorystatus(id: string): Promise<AxiosResponse> {
    return axiosInstance.get(`training-status/${id}/`);
  },

  updateBotCalendlyEnabled(botId: string, calendly_enabled: boolean): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { "calendly_enabled": calendly_enabled });
  },

  updateBotCalendlyLink(botId: string, calendly_link: string): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { "calendly_link": calendly_link });
  },
  updateBotHubspotEnabled(botId: string, hubspot_enabled: boolean): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/bots/${botId}/`, { "hubspot_enabled": hubspot_enabled });
  },

  // Integration CRUD
  getIntegrations(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/integrations/');
  },
  createIntegration(type: string, config: Record<string, string>): Promise<AxiosResponse> {
    return axiosInstance.post('admin/integrations/', { type, config, enabled: true });
  },
  updateIntegration(id: number, data: { config?: Record<string, string>; enabled?: boolean }): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/integrations/${id}/`, data);
  },
  deleteIntegration(id: number): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/integrations/${id}/`);
  },

  // Custom API Endpoints
  getEndpoints(integrationId: number): Promise<AxiosResponse> {
    return axiosInstance.get(`admin/integrations/${integrationId}/endpoints/`);
  },
  createEndpoint(integrationId: number, data: { name: string; description: string; method: string; path: string }): Promise<AxiosResponse> {
    return axiosInstance.post(`admin/integrations/${integrationId}/endpoints/`, { ...data, integration: integrationId });
  },
  updateEndpoint(integrationId: number, endpointId: number, data: Partial<{ name: string; description: string; method: string; path: string; enabled: boolean }>): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/integrations/${integrationId}/endpoints/${endpointId}/`, data);
  },
  deleteEndpoint(integrationId: number, endpointId: number): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/integrations/${integrationId}/endpoints/${endpointId}/`);
  },

  analyticsSummary(botId: string, days: string = '30'): Promise<AxiosResponse> {
    return axiosInstance.get(`analytics/summary/?bot_id=${botId}&days=${days}`);
  },

  conversationList(botId: string, days: string = '30', page: number = 1, search: string = ''): Promise<AxiosResponse> {
    return axiosInstance.get(`analytics/conversations/?bot_id=${botId}&days=${days}&page=${page}&search=${encodeURIComponent(search)}`);
  },

  conversationDetail(sessionId: string): Promise<AxiosResponse> {
    return axiosInstance.get(`analytics/conversations/${sessionId}/`);
  },

  smtpTest(config: Record<string, string>): Promise<AxiosResponse> {
    return axiosInstance.post('integrations/smtp/test/', config);
  },

  // API Keys (Phase 6)
  listApiKeys(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/api-keys/');
  },
  createApiKey(name: string, botId?: string): Promise<AxiosResponse> {
    return axiosInstance.post('admin/api-keys/', { name, bot_id: botId || null });
  },
  updateApiKey(id: number, data: { name?: string; enabled?: boolean }): Promise<AxiosResponse> {
    return axiosInstance.patch(`admin/api-keys/${id}/`, data);
  },
  deleteApiKey(id: number): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/api-keys/${id}/`);
  },

  // Subscriptions (Phase 7)
  listSubscriptionPlans(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/subscriptions/plans/');
  },
  mySubscription(): Promise<AxiosResponse> {
    return axiosInstance.get('admin/subscriptions/my/');
  },
  updateSubscription(planId: number, billingCycle: string = 'monthly'): Promise<AxiosResponse> {
    return axiosInstance.post('admin/subscriptions/my/', { plan_id: planId, billing_cycle: billingCycle });
  },

  // Web Sources
  getWebSources(botId: string | number): Promise<AxiosResponse> {
    return axiosInstance.get(`admin/web-sources/?bot_id=${botId}`);
  },
  addWebSource(data: { bot: number; tenant: number; url: string; source_type: string; max_pages?: number }): Promise<AxiosResponse> {
    return axiosInstance.post('admin/web-sources/', data);
  },
  deleteWebSource(id: number): Promise<AxiosResponse> {
    return axiosInstance.delete(`admin/web-sources/${id}/`);
  },
};

export default API;
