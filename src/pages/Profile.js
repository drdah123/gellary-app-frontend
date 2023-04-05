import React, { useContext, useState } from 'react';
import Spinner from '../components/Spinner';
import { MY_POSTS, DELETE_POST, UPDATE_POST } from '../queries';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import Error from '../components/Error';
import PostItem from '../components/PostItem';
import SimpleModal from '../components/SimpleModal';
import { NavLink } from 'reactstrap';
import authContext from '../context/auth-context';

export default function ProfilePage() {
  const [alert, setAlert] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const value = useContext(authContext);

  const client = useApolloClient();

  function PostsList() {
    const { error, loading, data } = useQuery(MY_POSTS);

    if (loading) {
      return <Spinner />;
    }
    if (error) {
      setAlert(error?.message);
      return;
    }

    client.refetchQueries({
      include: ['Posts'],
    });
    const showDetailHandler = (postId) => {
      const clickedPost = data?.getMyPosts.find((post) => post._id === postId);
      setSelectedPost(clickedPost);
    };
    return (
      <div>
        <Error error={alert} />
        <div className="row">
          <div className="col-md-8 offset-md-2">
            {data?.getMyPosts.map((post) => (
              <PostItem
                isProfilePost
                key={post?._id}
                {...post}
                onDeletePost={() => {
                  deletePost({ variables: { postId: post?._id } });
                }}
                onDetail={showDetailHandler}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const [deletePost] = useMutation(DELETE_POST, {
    onError: (error) => setAlert(error.message),
    onCompleted: () => {
      setAlert('تم إلغاء حجزك');
    },
  });

  return (
    <div className="container-fluid">
      <h2>منشوراتك</h2>
      <PostsList />
      {selectedPost && (
        <SimpleModal
          selectedPost={selectedPost}
          setAlert={setAlert}
          setSelectedPost={setSelectedPost}
        />
      )}
    </div>
  );
}
