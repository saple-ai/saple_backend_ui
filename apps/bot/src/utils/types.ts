export interface BotDetailsItem {
  blob_storage: number;
  container: number;
  created_by_id: number;
  created_by_name: string;
  created_date: string;
  id: number;
  uuid: string;
  media_type: string;
  name: string;
  tenant: number;
  updated_by_id: number | null;
  updated_by_name: string | null;
  updated_date: string;
}
