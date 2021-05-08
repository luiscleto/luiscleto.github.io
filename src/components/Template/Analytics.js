import React from 'react';

const { NODE_ENV } = process.env;

const Analytics = () => {
  if (NODE_ENV === 'production') {
    return (<script
      data-goatcounter="https://cleto.dev.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"
    />);
  }

  return null;
};

export default Analytics;
