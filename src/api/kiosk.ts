import { ProductSuggestion, ProductSuggestionPayload } from 'models/apiModels';
import { Delete, get, post } from './requests';

export const addSuggestion = (suggestion: ProductSuggestionPayload) =>
  post<{}>('kiosk/suggestion', suggestion);

export const getSuggestions = () =>
  get<ProductSuggestion[]>('kiosk/suggestions');

export const deleteSuggestion = (id: string) =>
  Delete<{}>('kiosk/suggestion/' + id);
