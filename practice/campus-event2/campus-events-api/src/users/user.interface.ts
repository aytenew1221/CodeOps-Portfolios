import { UserRole } from './user-role.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface UsersFile {
  users: User[];
}
