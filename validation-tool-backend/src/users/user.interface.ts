export interface User {
  source_id: number;
  source_type: string;
  organization_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
