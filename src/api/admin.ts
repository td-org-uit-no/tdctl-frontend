import { AdminMemberUpdate } from 'models/apiModels';
import { Delete, put } from './requests';

export const adminUpdateMember = (
  id: string,
  memberUpdate: AdminMemberUpdate
) => put<AdminMemberUpdate>(`admin/member/${id}`, memberUpdate);

export const deleteMember = (id: string): Promise<{ id: string }> =>
  Delete<{ id: string }>('admin/member/' + id);
