import { Role } from '../auth/role.enum';

export interface Privileges {
  run_id: number;
  agency: string;
  roles: Role[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  privileges: Privileges[];
}
