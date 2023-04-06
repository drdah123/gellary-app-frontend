import { useApolloClient, useQuery } from '@apollo/client';
import { Spinner } from 'reactstrap';
import PostItem from './PostItem';
import { MY_POSTS, POSTS } from '../queries';
import { useEffect } from 'react';

export default function PostsList({
  setAlert,
  setSelectedPost,
  isProfilePost,
  setIsShow,
  setPostUpdated,
  setIsUpdate,
  deletePost,
}) {
  const client = useApolloClient();

  const { loading, error, data } = useQuery(isProfilePost ? MY_POSTS : POSTS);

  const posts = data?.posts || data?.getMyPosts;
  useEffect(() => {
    client.refetchQueries({
      include: isProfilePost ? ['GetMyPosts'] : ['Posts'],
    });
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (error) {
    setAlert(error.message);
    return;
  }

  const showDetailHandler = (postId, type) => {
    const clickedPost = posts?.find((post) => post._id === postId);
    setSelectedPost(clickedPost);
    if (isProfilePost) {
      if (type === 'show') {
        setIsShow(true);
      }
      if (type === 'update') {
        setPostUpdated(clickedPost);
        setIsUpdate(true);
      }
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {posts?.map((post) => (
          <PostItem
            isProfilePost={isProfilePost}
            key={post._id}
            onDeletePost={() => {
              deletePost({
                variables: { postId: post?._id, postImage: post?.image },
              });
            }}
            {...post}
            onDetail={showDetailHandler}
          />
        ))}
      </div>
    </div>
  );
}
