import { gql } from '@apollo/client';
import PostFields from './fragments';
export const POSTS = gql`
  ${PostFields}
  query Posts {
    posts {
      ...PostFields
      creator {
        _id
      }
    }
  }
`;
export const MY_POSTS = gql`
  ${PostFields}
  query GetMyPosts {
    getMyPosts {
      ...PostFields
      creator {
        _id
      }
    }
  }
`;
export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      email
      name
      likes {
        post
      }
      _id
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(userInput: { name: $name, email: $email, password: $password }) {
      token
      email
      name
      likes
      _id
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      message
    }
  }
`;

export const CREATE_POST = gql`
  ${PostFields}
  mutation CreatePost($title: String!, $description: String!, $file: Upload!) {
    createPost(
      postInput: { title: $title, description: $description, file: $file }
    ) {
      ...PostFields
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId) {
      Message
    }
  }
`;
export const UPLOAD_IMAGE = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      message
    }
  }
`;
export const UPDATE_POST = gql`
  ${PostFields}
  mutation UpdatePost(
    $postId: ID!
    $title: String!
    $description: String!
    $image: String!
  ) {
    updatePost(
      postId: $postId
      postInput: { title: $title, description: $description, image: $image }
    ) {
      ...PostFields
    }
  }
`;

export const POST_ADDED = gql`
  ${PostFields}
  subscription {
    postAdded {
      ...PostFields
    }
  }
`;
