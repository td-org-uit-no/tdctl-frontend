import { JobItem, CreateJob } from 'models/apiModels';

import { get, post, Delete } from './requests';

export const getJobs = (): Promise<JobItem[]> => get<JobItem[]>('jobs/');

export const getJob = (id: string): Promise<JobItem> =>
  get<JobItem>('jobs/' + id);

export const createJob = (job: CreateJob): Promise<{ id: string }> =>
  post<{ id: string }>('jobs/', job, true);

export const uploadJobPicture = (id: string, jobImage: any) =>
  post<{}>('jobs/' + id + '/image', jobImage, true, 'multipart/form-data');

export const getJobImage = (id: string): Promise<{ image: any }> =>
  get<{ image: any }>('jobs/' + id + '/image', true);

export const deleteJob = (id: string): Promise<{ id: string }> =>
  Delete<{ id: string }>('jobs/' + id, true);
