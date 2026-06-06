import { Blocks } from 'react-loader-spinner';

import css from './GlobalLoader.module.css';

function GlobalLoader() {
  return (
    <div className={css.overlay}>
      <Blocks
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </div>
  );
}
export default GlobalLoader;
