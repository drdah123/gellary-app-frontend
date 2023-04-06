import React, { useContext, useMemo } from 'react';
import { SuitHeartFill } from 'react-bootstrap-icons';
import authContext from '../context/auth-context';

export default function PostItem({
  _id,
  image,
  likesNumber,
  onDetail,
  onDeletePost,
  isProfilePost,
}) {
  const { likes } = useContext(authContext);

  const isUserLike = useMemo(
    () => likes?.some((item) => item.post === _id),
    [likes]
  );
  return (
    <div className=" mb-3 col-md-4 col-lg-3 col-6">
      <div className="card" onClick={() => onDetail(_id, 'show')}>
        <img
          className="card-img-top"
          src={process.env.REACT_APP_BACKEND_URL + image}
          alt="Card cap"
        />
        <div className="card-img-overlay">
          <p>
            <SuitHeartFill color={isUserLike ? 'red' : '#fff'} /> {likesNumber}
          </p>
        </div>
      </div>
      {isProfilePost ? (
        <div>
          <button className="btn" onClick={() => onDeletePost(_id)}>
            حذف
          </button>
          <button className="btn" onClick={() => onDetail(_id, 'update')}>
            تعديل
          </button>
        </div>
      ) : null}
    </div>
  );
}
