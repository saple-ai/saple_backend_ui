export interface LoginCredentials {
    username: string;
    password: string;
}

export interface UserRegistration {
    username: string;
    password: string;
    email: string;
    phone: string;
}

export interface DashboardProps {
    className?: string;
}
  
export interface Tenant {
    id: number;
    name: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
    created_by_id: number;
    created_date: string;
    updated_by_id: number | null;
    updated_date: string;
    uuid: string;
    domain: string;
    email: string;
}

export interface Bot {
    blob_storage: number;
    container: number;
    created_by_id: number;
    created_by_name: string;
    created_date: string;
    id: number;
    media_type: 'text' | 'audio' | 'both';
    name: string;
    tenant: number;
    updated_by_id: number | null;
    updated_by_name: string | null;
    updated_date: string;
}
  
export interface ActiveMessage {
    bot: string | null;
    tenant: string | number;
    local_uuid: string | null;
    timestamp: string;
}

export interface User {
    id: number;
    username?: string;
    password?: string;
    email?: string;
    tenant: number;
    phone?: string;
}

export interface FormData {
    name: string;
    domain: string;
    email: string;
    contact_person_name: string;
    contact_person_email: string;
    contact_person_phone: string;
}

export interface Container {
    id: number;
    name: string;
    blob_storage?: number;
}

export interface FormDataStep1 {
    name: string;
}

export interface FormDataStep2 {
    type: 'existing' | 'new';
    blob_storage: string | number;
    account_name?: string;
    account_key?: string;
}

export interface FormDataStep3 {
    type: 'existing';
    container_name: string;
}

export interface Storage {
    id: number;
    tenant: number;
    account_name: string;
    account_key: string;
}

export interface TrainingResult {
    blob_storage: number;
    bot: number;
    container: number;
    message: string;
    status: string;
    tenant: number;
    time_taken_to_generate_embedding_vectors: number;
    time_taken_to_process_files_from_blob_storage: number;
}