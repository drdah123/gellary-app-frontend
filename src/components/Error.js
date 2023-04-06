import React from 'react';
import { Alert } from 'reactstrap';

const Error = ({ error }) => {
  return error ? <Alert>{error}</Alert> : '';
};

export default Error;
