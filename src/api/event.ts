import {
  CreateEvent,
  EventUpdate,
  Participant,
  Event,
  JoinEventPayload,
} from 'models/apiModels';
import { get, post, put, Delete } from './requests';

export const createEvent = (event: CreateEvent): Promise<{ eid: string }> =>
  post<{ eid: string }>('event/', event, true);

export const uploadEventPicture = (id: string, eventImage: any) =>
  post<{}>('event/' + id + '/image', eventImage, true, 'multipart/form-data');

export const getEventById = (id: string, auth: boolean): Promise<Event> =>
  get<Event>('event/' + id, auth);

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

export const deleteEvent = (eid: string) => Delete<{}>('event/' + eid, true);

export const getUpcomingEvents = (auth: boolean): Promise<Event[]> =>
  get<Event[]>('event/upcoming', auth);

export const deleteParticipant = (
  eid: string,
  id: string
): Promise<{ id: string }> =>
  Delete('event/' + eid + '/removeParticipant/' + id, true);

export const exportEvent = (eid: string): Promise<{}> =>
  get<{}>('event/' + eid + '/export', true);
