import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  ReactGA.initialize(REACT_APP_GA_TRACKING_ID);
}

const Analytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (NODE_ENV === 'production') {
      return `<script data-goatcounter="https://${pathname}.goatcounter.com/count"
              async src="//gc.zgo.at/count.js"/>`
    }
  }, [pathname]);

  return null;
};

export default Analytics;
