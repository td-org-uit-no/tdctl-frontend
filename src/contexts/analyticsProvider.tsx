import { useState, useEffect, createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { findParentPath } from 'utils/path';
import { logVisit, postUniqueVisit } from 'api';
import { IPageVisit } from 'models/apiModels';
import { AuthenticateContext } from './authProvider';

export interface IAnalytics {
  // paths the context should track visits
  paths: string[];
  // optional: turn off tracking on localhost
  localhost?: boolean;
  children?: React.ReactNode;
}

// provider without sharing a value, the analytic context is only to ensure
// the analytic logic runs on every route
export const AnalyticsContext = createContext({
  setUniqueVisit: (_: boolean) => {},
});

// uses state to avoid sending unnecessary unique visit requests
// refresh resets the state
const AnalyticsProvider = ({ paths, localhost, children }: IAnalytics) => {
  const { authenticated, isValidating } = useContext(AuthenticateContext);
  const [uniqueVisit, setUniqueVisit] = useState(false);
  const location = useLocation();

  const followUniqueVisit = () => {
    const timeout = 1000 * 60 * 60 * 24;
    // reset unique visit every day to avoid unnecessary requests to stats api
    const timer = setInterval(() => setUniqueVisit(false), timeout);

    return () => {
      clearInterval(timer);
    };
  };

  const validPath = (currentPath: string) => {
    const parentPath = findParentPath(currentPath);
    return parentPath !== undefined ? paths.includes(parentPath) : false;
  };

  const logUniqueVisit = async () => {
    try {
      // needs to await as errors will cause app to crash
      await postUniqueVisit();
      setUniqueVisit(true);
    } catch (error) {
      // ignores logging errors
    }
  };

  const logUserVisit = async (currentPath: string) => {
    if (localhost || !validPath(currentPath)) {
      return;
    }

    const payload = { page: currentPath } as IPageVisit;
    try {
      // needs to await as errors will cause app to crash
      await logVisit(payload);
    } catch (error) {
      console.log(error);
      // ignores logging errors
    }
  };

  useEffect(() => {
    // reset unique visit state after 24 hours
    followUniqueVisit();
  }, []);

  useEffect(() => {
    if (isValidating || uniqueVisit) {
      // wait until auth state is finished propagating
      return;
    }

    if (!authenticated) {
      // handles reseting state between login/logout
      setUniqueVisit(false);
      return;
    }
    logUniqueVisit();
  }, [uniqueVisit, authenticated, isValidating]);

  // tracks react router changes and logs the desired pages
  useEffect(() => {
    logUserVisit(location.pathname);
    if (!uniqueVisit) {
      logUniqueVisit();
    }
  }, [location.pathname]);

  return (
    <AnalyticsContext.Provider value={{ setUniqueVisit }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
