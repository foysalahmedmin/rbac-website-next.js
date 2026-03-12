export interface IUser {
  id: number;
  name: string;
  email: string;
  status: "active" | "suspended" | "banned";
  role: {
    id: number;
    name: string;
    permissions?: {
      permission: {
        id: number;
        slug: string;
      };
    }[];
  };
  direct_permissions?: {
    permission: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
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
