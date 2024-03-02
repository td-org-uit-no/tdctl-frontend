import { useHistory } from 'react-router-dom';

export const useNavigateWithNewTab = () => {
  const history = useHistory();

const navigate = (path: string, event?: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event)
    if (event && (event.ctrlKey || event.button === 1)) {
        // Open in a new tab for CTRL+click or middle mouse button
        const newTab = window.open(history.createHref({ pathname: path }), '_blank');
        newTab?.focus();
        event.preventDefault();
    } else {
        // Regular navigation
        history.push(path);        
    }
};

  return navigate;
};

