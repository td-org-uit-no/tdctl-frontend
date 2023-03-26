import {
  CreateEvent,
  EventUpdate,
  Participant,
  Event,
  JoinEventPayload,
  ParticipantsUpdate,
} from 'models/apiModels';
import { get, post, put, Delete } from './requests';

export const createEvent = (event: CreateEvent): Promise<{ eid: string }> =>
  post<{ eid: string }>('event/', event);

export const uploadEventPicture = (id: string, eventImage: any) =>
  post<{}>('event/' + id + '/image', eventImage, 'multipart/form-data');

export const getEventById = (id: string): Promise<Event> =>
  get<Event>('event/' + id);

export const joinEvent = (id: string, joinEventPayload: JoinEventPayload) =>
  post<{ max: boolean }>('event/' + id + '/join', joinEventPayload);

export const leaveEvent = (id: string) =>
  post<{ max: boolean }>('event/' + id + '/leave', {});

export const isJoinedEvent = (id: string): Promise<{ joined: boolean }> =>
  get<{ joined: boolean }>('event/' + id + '/joined');

export const isConfirmedEvent = (id: string): Promise<{ confirmed: boolean }> =>
  get<{ confirmed: boolean }>('event/' + id + '/confirmed');

export const getEventOptions = (id: string): Promise<JoinEventPayload> =>
  get<JoinEventPayload>('event/' + id + '/options');

export const updateEventOptions = (id: string, payload: JoinEventPayload) =>
  put<JoinEventPayload>('event/' + id + '/update-options', payload);

export const getEventImage = (eid: string): Promise<{ image: any }> =>
  get<{ image: any }>('event/' + eid + '/image');

export const getJoinedParticipants = (eid: string): Promise<Participant[]> =>
  get<Participant[]>('event/' + eid + '/participants');

export const updateEvent = (eid: string, eventUpdate: EventUpdate) =>
  put<EventUpdate>('event/' + eid, eventUpdate);

export const deleteEvent = (eid: string) => Delete<{}>('event/' + eid);

export const getUpcomingEvents = (): Promise<Event[]> =>
  get<Event[]>('event/upcoming');

export const getJoinedEvents = (): Promise<Event[]> =>
  get<Event[]>('event/joined-events');

export const deleteParticipant = (
  eid: string,
  id: string
): Promise<{ id: string }> =>
  Delete('event/' + eid + '/removeParticipant/' + id);

export const exportEvent = (eid: string): Promise<{}> =>
  get<{}>('event/' + eid + '/export');

export const confirmEvent = (eid: string): Promise<{}> =>
  post<{}>('event/' + eid + '/confirm', {});

export const reorderParticipants = (
  eid: string,
  updateList: { updateList: ParticipantsUpdate[] }
): Promise<{}> =>
  put<{ updateList: ParticipantsUpdate[] }>(
    'event/' + eid + '/updateParticipantsOrder',
    updateList
  );
