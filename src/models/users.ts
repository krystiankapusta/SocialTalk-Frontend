export interface User {
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: any[];
  credentialsNonExpired: boolean;
  email: string;
  enabled: boolean;
  id: number;
  password: string;
  username: string;
  verificationCodeExpiredAt: string;
}
