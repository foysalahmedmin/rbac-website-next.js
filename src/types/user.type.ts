export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "banned";
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface IAuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}
