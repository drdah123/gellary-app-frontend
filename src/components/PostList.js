import { useApolloClient, useQuery } from '@apollo/client';
import { Spinner } from 'reactstrap';
import PostItem from './PostItem';
import { POSTS } from '../queries';

export default function PostList({ setAlert, setSelectedPost }) {
  const client = useApolloClient();

  const { loading, error, data } = useQuery(POSTS);

  if (loading) {
    return <Spinner />;
  }
  if (error) {
    setAlert(error.message);
    return;
  }

  client.refetchQueries({
    include: ['Posts'],
  });

  const showDetailHandler = (postId) => {
    const clickedPost = data?.posts.find((post) => post._id === postId);
    setSelectedPost(clickedPost);
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        {data?.posts.map((post) => (
          <PostItem key={post._id} {...post} onDetail={showDetailHandler} />
        ))}
      </div>
    </div>
  );
}
