import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useMutation, useApolloClient, useSubscription } from '@apollo/client';
import { CREATE_POST, POST_ADDED } from '../queries';
import SimpleModal from '../components/SimpleModal';
import AuthContext from '../context/auth-context';
import Error from '../components/Error';
import Spinner from '../components/Spinner';
import PostList from '../components/PostsList';
import CreatePost from '../components/CreatePost';

export const initialPostState = {
  title: '',
  file: null,
  description: '',
};

export default function PostsPage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const value = useContext(AuthContext);

  const [alert, setAlert] = useState('');
  const [modelAlert, setModelAlert] = useState('');
  const [creating, setCreating] = useState(false);
  const [post, setPost] = useState(initialPostState);
  const client = useApolloClient();
  useSubscription(POST_ADDED, {
    onSubscriptionData: async ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const addedPost = subscriptionData.data.postAdded;
        setAlert(`مناسبة جديدة بعنوان: ${addedPost.title}، أُضيفت للتو`);
        window.scrollTo(0, 0);
      }
      if (subscriptionData.errors) setAlert('خطأ في جلب المنشورات الجديدة');
    },
  });

  function onCancel() {
    setSelectedPost(null);
    setCreating(false);
    setAlert('');
  }

  function postHandler(item, value) {
    setPost((prevS) => ({ ...prevS, [item]: value }));
  }

  const [postConfirmHandler, { createPostLoading, createPostError }] =
    useMutation(CREATE_POST, {
      onError: (error) => {
        setCreating(false);
        setAlert(error.message);
      },
      onCompleted: () => {
        setCreating(false);
        setAlert('تم إضافة المنشور بنجاح');
        setModelAlert('');
        client.refetchQueries({
          include: ['Posts'],
        });
      },
    });

  function onConfirm() {
    if (
      post.title.trim().length === 0 ||
      post.file === null ||
      post.description.trim().length === 0
    ) {
      setModelAlert('يجب ملئ جميع الحقول بالشكل الصحيح!');
      return;
    }
    postConfirmHandler({
      variables: {
        ...post,
      },
    });

    setPost(initialPostState);
  }

  if (createPostLoading) {
    return <Spinner />;
  }

  if (createPostError) {
    setAlert(createPostError.message);
    return;
  }

  return (
    <div>
      {value.token && <Error error={alert} />}
      {value.token && (
        <div className="events-control pt-2 text-center pb-3">
          <h2>شارك صورك الخاصة!</h2>
          <button className="btn" onClick={() => setCreating(true)}>
            إنشاء منشور
          </button>
        </div>
      )}
      <div>
        <h2 className="mb-3">المنشورات </h2>
        <PostList setAlert={setAlert} setSelectedPost={setSelectedPost} />
      </div>
      <CreatePost
        creating={creating}
        modelAlert={modelAlert}
        onCancel={onCancel}
        onConfirm={onConfirm}
        post={post}
        postHandler={postHandler}
      />
      <SimpleModal
        selectedPost={selectedPost}
        setAlert={setAlert}
        setSelectedPost={setSelectedPost}
        show={selectedPost}
        onCancel={onCancel}
      />
    </div>
  );
}
