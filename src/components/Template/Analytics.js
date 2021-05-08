import React from 'react';
import { useLocation } from 'react-router-dom';

const { NODE_ENV } = process.env;

const Analytics = () => {
  const { pathname } = useLocation();

  if (NODE_ENV === 'production') {
    return (
      <span>
        <script>{`window.goatcounter = { path: '${pathname}' || '/' }`}</script>
        <script
          data-goatcounter="https://ksdbfg234jl342lk636l33sd.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
      </span>);
  }

  return null;
};

export default Analytics;
