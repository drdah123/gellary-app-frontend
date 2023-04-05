import React, { useContext, useEffect, useMemo, useState } from 'react';
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
    <div className=" col-md-4 col-lg-3 col-6" onClick={() => onDetail(_id)}>
      <div className="card">
        <img
          className="card-img-top"
          src={'http://localhost:4000/' + image}
          alt="Card cap"
        />
        <div className="card-img-overlay">
          <p>
            <SuitHeartFill color={isUserLike ? 'red' : '#fff'} /> {likesNumber}
          </p>
        </div>
        {isProfilePost ? (
          <button className="btn" onClick={() => onDeletePost(_id)}>
            حذف
          </button>
        ) : null}
      </div>
    </div>
  );
}
