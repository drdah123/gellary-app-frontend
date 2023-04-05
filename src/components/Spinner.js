import { Puff } from 'react-loader-spinner';

export const Spinner = () => (
  <div className="d-flex justify-content-center ">
    <Puff color="#var(--primary-color)" height={100} width={100} />
  </div>
);

export default Spinner;