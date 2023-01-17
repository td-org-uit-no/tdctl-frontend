import {
  ChangePasswordPayload,
  Member,
  MemberUpdate,
  PartialMember,
} from 'models/apiModels';
import { get, post, put } from './requests';

export const registerMember = (partialMember: PartialMember) =>
  post<string>('member/', partialMember);

export const getMemberAssociatedWithToken = (): Promise<Member> =>
  get<Member>('member/', true);

export const activateUser = () => post<{}>('member/activate', {}, true);

export const getMemberById = (uid: string): Promise<PartialMember> =>
  get<PartialMember>('member/' + uid, true);

export const getMemberByEmail = (email: string): Promise<{ id: string }> =>
  get<{ id: string }>('member/email/' + email, true);

export const updateMember = (memberUpdate: MemberUpdate) =>
  put<MemberUpdate>('member/', memberUpdate, true);

export const changePassword = (passwordPayload: ChangePasswordPayload) =>
  post<ChangePasswordPayload>('auth/password', passwordPayload, true);

export const getAllMembers = () => get<Array<Member>>('members/', true);

export const confirmMember = (confimationCode: string) => post<{}>('member/confirm/' + confimationCode, '')

export const sendNewVerificationEmail = (email: string) => post<{}>('member/confirm/code/' + email, '')

export const sendRestorePasswordEmail = (email: string) => post<{}>('member/reset-password/code/' + email, '')

export const resetPassword = (code: string, password: string) => post<{}>('member/reset-password/', {token: code, newPassword: password})

