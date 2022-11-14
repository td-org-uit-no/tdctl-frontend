import {
  CreateEvent,
  EventUpdate,
  Participant,
  Event,
  JoinEventPayload,
} from 'models/apiModels';
import { get, post, put } from './requests';

export const createEvent = (event: CreateEvent): Promise<{ eid: string }> =>
  post<{ eid: string }>('event/', event, true);

export const uploadEventPicture = (id: string, eventImage: any) =>
  post<{}>('event/' + id + '/image', eventImage, true, 'multipart/form-data');

export const getEventById = (id: string): Promise<Event> =>
  get<Event>('event/' + id, true);

export const joinEvent = (id: string, joinEventPayload: JoinEventPayload) =>
  post<{ max: boolean }>('event/' + id + '/join', joinEventPayload, true);

export const leaveEvent = (id: string) =>
  post<{ max: boolean }>('event/' + id + '/leave', {}, true);

export const isJoinedEvent = (id: string): Promise<{ joined: boolean }> =>
  get<{ joined: boolean }>('event/' + id + '/joined', true);

export const getEventImage = (eid: string): Promise<{ image: any }> =>
  get<{ image: any }>('event/' + eid + '/image', true);

export const getJoinedParticipants = (eid: string): Promise<Participant[]> =>
  get<Participant[]>('event/' + eid + '/participants', true);

export const updateEvent = (eid: string, eventUpdate: EventUpdate) =>
  put<EventUpdate>('event/' + eid, eventUpdate, true);

export const getUpcomingEvents = (): Promise<Event[]> =>
  get<Event[]>('event/upcoming');

// export const getEventPosts = (eid: string): Promise<Post[]> =>
//   get<Post[]>('event/' + eid + '/posts', true);
// export const postToEvent = (
//   eid: string,
//   postText: { message: string }
// ): Promise<{}> => post<{}>('event/' + eid + '/post', postText, true);
