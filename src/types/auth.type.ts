import { IAuthUser } from "./user.type";

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    info: IAuthUser;
  };
}

export interface IRefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    info: IAuthUser;
  };
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorMessages: {
    path: string | number;
    message: string;
  }[];
  stack?: string;
}
