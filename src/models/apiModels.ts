import { RoleOptions } from 'contexts/authProvider';

// Member model
export interface Member extends PartialMember {
  id: string;
  role: RoleOptions;
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

// export type Participant = Pick<Member, '_id' | 'realName'>;

export interface Participant {
  id: string;
  realName: string;
  email: string;
  classof: string;
  phone: string;
  role: string;
  food: boolean;
  transportation: boolean;
  dietaryRestrictions?: string;
  submitDate: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  accessToken: boolean;
  exp: number;
  iat: number;
  role: RoleOptions;
  user_id: string;
}

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export interface MemberUpdate {
  realName?: string;
  email?: string;
  classof?: string;
  phone?: string;
}

export interface AdminMemberUpdate extends MemberUpdate {
  status?: string;
  role?: RoleOptions;
  graduated?: boolean;
}

export interface Event {
  eid: string;
  title: string;
  description: string;
  date: string;
  address: string;
  price: number;
  duration?: number;
  extraInformation?: string;
  maxParticipants?: number;
  romNumber?: string;
  building?: string;
  participants?: Participant[];
  food: boolean;
  transportation: boolean;
  active: boolean;
}

export type EventUpdate = Partial<
  Pick<
    Event,
    'title' | 'description' | 'date' | 'address' | 'participants' | 'active'
  >
>;
export type CreateEvent = Omit<Event, 'eid'>;

export interface Comment {
  comment: string;
  author: string;
  created_at: Date;
}

export interface Post {
  id: string;
  message: string;
  author: string;
  created_at: string;
  comments: Comment[];
}

export interface JoinEventPayload {
  food?: boolean;
  transportation?: boolean;
  dietaryRestrictions?: string;
}
