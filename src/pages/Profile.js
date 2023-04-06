import React, { useState } from 'react';
import {
  DELETE_POST,
  UPDATE_POST,
  UPDATE_POST_WITHOUT_IMAGE,
} from '../queries';
import { useMutation, useApolloClient } from '@apollo/client';
import Error from '../components/Error';
import SimpleModal from '../components/SimpleModal';
import CreatePost from '../components/CreatePost';
import { initialPostState } from './Post';
import PostsList from '../components/PostsList';

export default function ProfilePage() {
  const [alert, setAlert] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [postUpdated, setPostUpdated] = useState(initialPostState);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [modelAlert, setModelAlert] = useState('');

  const client = useApolloClient();

  function onCancel() {
    setSelectedPost(null);
    setIsShow(false);
    setIsUpdate(false);
    setAlert('');
  }
  const [postConfirmHandler] = useMutation(UPDATE_POST, {
    onError: (error) => {
      setIsShow(false);
      setIsUpdate(false);
      setAlert(error.message);
    },
    onCompleted: () => {
      setIsShow(false);
      setIsUpdate(false);
      setAlert('تم تعديل المنشور بنجاح');
    },
  });
  const [postConfirmHandlerWithoutImage] = useMutation(
    UPDATE_POST_WITHOUT_IMAGE,
    {
      onError: (error) => {
        setIsShow(false);
        setIsUpdate(false);
        setAlert(error.message);
      },
      onCompleted: () => {
        setIsShow(false);
        setIsUpdate(false);
        setAlert('تم تعديل المنشور بنجاح');
        client.refetchQueries({
          include: ['GetMyPosts'],
        });
      },
    }
  );

  function postHandler(item, value) {
    setPostUpdated((prevS) => ({ ...prevS, [item]: value }));
  }

  function onConfirm(_id) {
    if (
      postUpdated.title.trim().length === 0 ||
      postUpdated.description.trim().length === 0
    ) {
      setModelAlert('يجب ملئ جميع الحقول بالشكل الصحيح!');
      return;
    }
    if (postUpdated.file === selectedPost.file) {
      postConfirmHandlerWithoutImage({
        variables: { postId: _id, ...postUpdated },
      });
    } else {
      postConfirmHandler({
        variables: {
          postId: _id,
          ...postUpdated,
        },
      });
    }

    setPostUpdated(initialPostState);
  }

  const [deletePost] = useMutation(DELETE_POST, {
    onError: (error) => setAlert(error.message),
    onCompleted: () => {
      setAlert('تم حذف المنشور');
      client.refetchQueries({
        include: ['GetMyPosts'],
      });
    },
  });

  return (
    <div className="container-fluid">
      <h2>منشوراتك</h2>
      <Error error={alert} />
      <PostsList
        setAlert={setAlert}
        setSelectedPost={setSelectedPost}
        isProfilePost
        setIsShow={setIsShow}
        setIsUpdate={setIsUpdate}
        setPostUpdated={setPostUpdated}
        deletePost={deletePost}
      />{' '}
      <CreatePost
        creating={isUpdate}
        modelAlert={modelAlert}
        onCancel={onCancel}
        onConfirm={onConfirm}
        post={postUpdated}
        postHandler={postHandler}
        isUpdate
      />
      <SimpleModal
        show={isShow}
        setShow={setIsShow}
        selectedPost={selectedPost}
        setAlert={setAlert}
        setSelectedPost={setSelectedPost}
        onCancel={onCancel}
      />
    </div>
  );
}
