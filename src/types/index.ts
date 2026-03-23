export interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
}

export type ProfileType = {
  userEmail: string;
  userName: string;
  firstName: string | undefined;
  lastName: string | undefined;
  status: boolean;
  createDate: string;
  phoneNumber: string | undefined;
  gender: string | undefined;
  birthDate: string | undefined;
  avatar: string | undefined;
};
