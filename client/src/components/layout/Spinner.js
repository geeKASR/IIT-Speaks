import React, { Fragment } from 'react';
import spinner from './layout-css/spinner.gif';

const Spinner = () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', display: 'block', left : '50%', top : '25%', position : 'absolute', transform : 'translate(-50%, -50%)' }}
      alt="Loading..."
    />
  </Fragment>
);

export default Spinner;