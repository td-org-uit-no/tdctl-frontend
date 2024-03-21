import { ProductSuggestion, ProductSuggestionPayload } from 'models/apiModels';
import { get, post } from './requests';

export const addSuggestion = (suggestion: ProductSuggestionPayload) =>
  post<{}>('kiosk/suggestion', suggestion);

export const getSuggestions = () =>
  get<ProductSuggestion[]>('kiosk/suggestions');
