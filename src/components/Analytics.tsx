import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const { VITE_MODE } = import.meta.env;

const Analytics = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (VITE_MODE !== 'production') return;

    // Create and inject the config script
    const configScript = document.createElement('script');
    configScript.innerHTML = `window.goatcounter = { path: '${pathname}' || '/' }`;
    document.head.appendChild(configScript);

    // Create and inject the counter script
    const counterScript = document.createElement('script');
    counterScript.async = true;
    counterScript.src = '//gc.zgo.at/count.js';
    counterScript.setAttribute('data-goatcounter', 'https://ksdbfg234jl342lk636l33sd.goatcounter.com/count');
    document.head.appendChild(counterScript);
  }, [pathname]); // Re-run when pathname changes

  return null;
};

export default Analytics; 