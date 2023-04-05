import { gql } from '@apollo/client';

const POST_FIELDS = gql`
  fragment PostFields on Post {
    _id
    title
    description
    image
    likesNumber
  }
`;
export default POST_FIELDS;
