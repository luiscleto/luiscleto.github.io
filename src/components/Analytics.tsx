import { useLocation } from 'react-router-dom';

const { MODE } = import.meta.env;

const Analytics = () => {
  const { pathname } = useLocation();

  if (MODE === 'production') {
    return (
      <span>
        <script>{`window.goatcounter = { path: '${pathname}' || '/' }`}</script>
        <script
          data-goatcounter="https://ksdbfg234jl342lk636l33sd.goatcounter.com/count"
          async
          src="//gc.zgo.at/count.js"
        />
      </span>
    );
  }

  return null;
};

export default Analytics; 