import {
  Committee,
  CommitteeInput,
  CommitteeUpdate,
  CommitteeMemberInput,
  CommitteeMemberListItem,
  PaginatedResponse,
} from 'models/apiModels';
import { get, post, put, Delete } from './requests';

// Query params for list endpoint
export interface CommitteeListQuery {
  status?: 'active' | 'inactive';
  hasOpenSpots?: boolean;
  q?: string;
  sort?:
    | 'name'
    | 'createdAt'
    | 'updatedAt'
    | '-name'
    | '-createdAt'
    | '-updatedAt';
  page?: number;
  limit?: number; // max 100
}

export const listCommittees = (
  query: CommitteeListQuery = {}
): Promise<PaginatedResponse<Committee>> => {
  // Convert boolean to string for query builder in requests.ts
  const params: any = {};
  if (query.status) params.status = query.status;
  if (typeof query.hasOpenSpots === 'boolean')
    params.hasOpenSpots = String(query.hasOpenSpots);
  if (query.q) params.q = query.q;
  if (query.sort) params.sort = query.sort;
  if (query.page) params.page = String(query.page);
  if (query.limit) params.limit = String(query.limit);
  return get<PaginatedResponse<Committee>>('committee', params);
};

export const getCommittee = (id: string): Promise<Committee> =>
  get<Committee>('committee/' + id);

export const createCommittee = (input: CommitteeInput): Promise<Committee> =>
  post<Committee>('committee', input);

export const updateCommittee = (
  id: string,
  update: CommitteeUpdate
): Promise<Committee> => put<Committee>('committee/' + id, update);

export const deleteCommittee = (id: string): Promise<{}> =>
  Delete<{}>('committee/' + id);

export const listCommitteeMembers = (
  id: string,
  opts: { year?: number; page?: number; limit?: number } = {}
): Promise<PaginatedResponse<CommitteeMemberListItem>> => {
  const params: any = {};
  if (opts.year) params.year = String(opts.year);
  if (opts.page) params.page = String(opts.page);
  if (opts.limit) params.limit = String(opts.limit);
  return get<PaginatedResponse<CommitteeMemberListItem>>(
    `committee/${id}/members`,
    params
  );
};

export const addCommitteeMember = (
  id: string,
  input: CommitteeMemberInput
): Promise<{}> => post<{}>(`committee/${id}/members`, input);

export const removeCommitteeMember = (
  id: string,
  userId: string,
  year?: number
): Promise<{}> => {
  let path = `committee/${id}/members/${userId}`;
  if (year) {
    path += `?year=${year}`;
  }
  return Delete<{}>(path);
};

export const leaveCommitteeSelf = (id: string, year?: number): Promise<{}> => {
  let path = `committee/${id}/members/self`;
  if (year) {
    path += `?year=${year}`;
  }
  return Delete<{}>(path);
};

// Apply to join a committee (sends email on backend)
export const applyToCommittee = (
  id: string,
  payload: { message?: string }
): Promise<{}> => post<{}>(`committee/${id}/apply`, payload);
