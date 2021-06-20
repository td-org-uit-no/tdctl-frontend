import { useLocation } from 'react-router-dom';

const useQueryParams = () => useLocation().search;

export default useQueryParams;
