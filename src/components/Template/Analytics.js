import { useLocation } from 'react-router-dom';

const { NODE_ENV } = process.env;

const Analytics = () => {
  const { pathname } = useLocation();

  if (NODE_ENV === 'production') {
    return `<script data-goatcounter="https://${pathname}.goatcounter.com/count"
              async src="//gc.zgo.at/count.js"/>`;
  }

  return null;
};

export default Analytics;
