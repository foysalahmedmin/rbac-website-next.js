export interface IRole {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  permissions?: {
    permission: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  created_at?: string;
  updated_at?: string;
}
