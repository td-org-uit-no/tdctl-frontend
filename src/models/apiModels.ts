// Member model
export interface Member extends PartialMember {
  _id: string;
  role: string;
  status: string;
}

export interface PartialMember {
  /* Used as a partial member for when user signs up */
  realName: string;
  email: string;
  password: string;
  classof: string;
  graduated: boolean;
  phone?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordPayload {
  password: string,
  newPassword: string,
}

export interface MemberUpdate {
	realName?: string;
	email?: string;
	classof?: string;
	phone?: string;
}

export interface Event {
  title: string;
  description?: string;
  date: string;
  address: string;
}
