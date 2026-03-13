export interface IRole {
  id: number;
  name: string;
  description: string | null;
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
