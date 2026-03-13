import { IAuthUser } from "./user.type";

export interface ILoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    access_token: string;
    info: IAuthUser;
  };
}

export interface IRefreshTokenResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    access_token: string;
    info: IAuthUser;
  };
}

export interface IErrorResponse {
  success: boolean;
  status: number;
  message: string;
  sources: {
    path: string | number;
    message: string;
  }[];
  error?: unknown;
  stack?: string;
}
