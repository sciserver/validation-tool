import { Role } from '../auth/role.enum';

export interface Privileges {
  run_id: number;
  roles: Role[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  privileges: Privileges[];
}
