export interface IUser {
  pk: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  isStaff: boolean;
}
