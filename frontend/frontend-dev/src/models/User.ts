export interface User {
  pk: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  isStaff: boolean;
}
