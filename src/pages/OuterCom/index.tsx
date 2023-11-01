import store from '@/store';
import React from 'react';
import { Provider } from 'react-redux';

const OuterCom: React.FC<{}> = (props) => {
  return (
    <div id="OuterCom">
      <Provider store={store}>{props.children}</Provider>
    </div>
  );
};
export default OuterCom;
