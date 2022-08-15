import { AdminMemberUpdate } from 'models/apiModels';
import { put } from './requests';

export const adminUpdateMember = (
  id: string,
  memberUpdate: AdminMemberUpdate
) => put<AdminMemberUpdate>(`admin/member/${id}`, memberUpdate, true);
