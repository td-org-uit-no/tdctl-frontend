import { JobItem, CreateJob } from 'models/apiModels';

import { get, post, Delete } from './requests';

export const getJobs = (): Promise<JobItem[]> => get<JobItem[]>('jobs/');

export const getJob = (id: string): Promise<JobItem> =>
  get<JobItem>('jobs/' + id);

export const createJob = (job: CreateJob): Promise<{ id: string }> =>
  post<{ id: string }>('jobs/', job);

export const uploadJobPicture = async (id: string, jobImage: File) => {
  const data = new FormData();
  data.append('image', jobImage, jobImage.name);
  await post<{}>('jobs/' + id + '/image', data, 'multipart/form-data');
};

export const getJobImage = (id: string): Promise<{ image: any }> =>
  get<{ image: any }>('jobs/' + id + '/image');

export const deleteJob = (id: string): Promise<{ id: string }> =>
  Delete<{ id: string }>('jobs/' + id);
