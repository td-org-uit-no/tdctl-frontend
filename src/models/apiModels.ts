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
  host: string;
  address: string;
  price: number;
  bindingRegistration: boolean;
  duration?: number;
  extraInformation?: string;
  maxParticipants?: number;
  romNumber?: string;
  building?: string;
  participants?: Participant[];
  food: boolean;
  transportation: boolean;
  public: boolean;
  registrationOpeningDate?: string;
}

export type EventUpdate = Partial<
  Pick<
    Event,
    | 'title'
    | 'description'
    | 'date'
    | 'address'
    | 'price'
    | 'maxParticipants'
    | 'public'
  >
>;
export type CreateEvent = Omit<Event, 'eid' | 'host'>;

export interface JoinEventPayload {
  food?: boolean;
  transportation?: boolean;
  dietaryRestrictions?: string;
}

export interface JobItem {
  id: string;
  company: string;
  title: string;
  type: string;
  tags: string[];
  description_preview: string;
  description: string;
  published_date: Date;
  location: string;
  link: string;
  start_date?: Date;
  due_date?: Date;
}

export type CreateJob = Omit<JobItem, 'id'>;
