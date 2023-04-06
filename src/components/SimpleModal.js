import React, { useContext, useEffect, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import { SuitHeartFill, XLg } from 'react-bootstrap-icons';
import authContext from '../context/auth-context';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../queries';

export default function SimpleModal({
  selectedPost,
  setSelectedPost,
  setAlert,
  onCancel,
  show,
  setShow,
}) {
  const value = useContext(authContext);

  const isUserLike = useMemo(
    () => value.likes?.some((item) => item.post === selectedPost?._id),
    [value.likes, selectedPost?._id]
  );

  const [likePostHandler, { data }] = useMutation(LIKE_POST, {
    onError: (error) => {
      setSelectedPost(null);
      setAlert(error.message);
      window.scrollTo(0, 0);
    },
    onCompleted: () => {
      setSelectedPost(null);
      setShow && setShow(false);
    },
  });

  useEffect(() => {
    let likes;

    if (data?.likePost.message === 'like remove') {
      likes = value.likes.filter((item) => item?.post !== selectedPost?._id);
      setAlert('تم ازالة اعجاب المنشور ');
      value.likesHandler(likes);
    } else if (data?.likePost.message === 'like added') {
      likes = [...value.likes, { post: selectedPost?._id }];
      setAlert('تم اعطاء اعجاب للمنشور ');
      value.likesHandler(likes);
    }
  }, [data]);

  return (
    <div>
      <Modal show={show} onHide={onCancel} className="custom-modal">
        <Modal.Body className="modal-body-card">
          <div className="card">
            <img
              className="card-img-top"
              src={process.env.REACT_APP_BACKEND_URL + selectedPost?.image}
              alt={selectedPost?.title}
            />

            <div className="card-body">
              <div className=" d-flex justify-content-between align-center">
                {' '}
                <h4 className="mb-4 card-title">{selectedPost?.title}</h4>
                <p>
                  <SuitHeartFill
                    className="btn-hover"
                    color={isUserLike ? 'red' : '#fff'}
                    onClick={(e) => {
                      e.preventDefault();
                      likePostHandler({
                        variables: { postId: selectedPost?._id },
                      });
                    }}
                  />{' '}
                  {selectedPost?.likesNumber}
                </p>{' '}
              </div>
              <p className="card-text">{selectedPost?.description}</p>
              <div className="card-img-overlay">
                <XLg className="btn-hover" onClick={onCancel} />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
