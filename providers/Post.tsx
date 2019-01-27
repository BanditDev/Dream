import gql from 'graphql-tag';
import { Component, FC } from 'react';
import { Query } from 'react-apollo';
import { getAccessToken } from '../lib/auth';

export const GET_POST = gql`
  query getPost($id: ID!) {
    post(id: $id) {
      id
      title
      nfws
      spoiler
      sourceId
      cover
      sourceType
      liked
      likesCount
      commentsCount
      createdAt
      channelName
      authorId
      pinned
      tags {
        id
        title
      }
    }
  }
`;

const POST_REMOVED = gql`
  subscription postRemoved($id: ID!) {
    postRemoved(id: $id)
  }
`;

const POST_COMMENT_COUNT_CHANGED = gql`
  subscription postCommentCountChanged($id: ID!) {
    postCommentCountChanged(id: $id)
  }
`;

const POST_LIKE_COUNT_CHANGED = gql`
  subscription postLikeCountChanged($id: ID!) {
    postLikeCountChanged(id: $id) {
      count
      userId
      liked
    }
  }
`;

interface IPropsInner {
  post: any;
  subscribePostRemoved: () => void;
  subscribePostCommentCountChanged: () => void;
  subscribePostLikeCountChanged: () => void;
  children: any;
}

class PostProviderInner extends Component<IPropsInner> {
  public componentDidMount() {
    this.props.subscribePostRemoved();
    this.props.subscribePostCommentCountChanged();
    this.props.subscribePostLikeCountChanged();
  }

  public render() {
    return this.props.children({
      post: this.props.post
    });
  }
}

interface IProps {
  id?: string;
}

const PostProvider: FC<IProps> = ({ children, id }) => {
  return (
    <Query query={GET_POST} variables={{ id }}>
      {({ subscribeToMore, loading, error, data }) => {
        if (loading) {
          return null;
        }

        if (error) {
          return null;
        }

        return (
          <PostProviderInner
            post={data.post}
            subscribePostRemoved={() => {
              subscribeToMore({
                document: POST_REMOVED,
                variables: { id },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }

                  return {
                    ...prev,
                    post: null
                  };
                }
              });
            }}
            subscribePostCommentCountChanged={() => {
              subscribeToMore({
                document: POST_COMMENT_COUNT_CHANGED,
                variables: { id },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }

                  const commentsCount =
                    subscriptionData.data.postCommentCountChanged;

                  return {
                    ...prev,
                    post: {
                      ...prev.post,
                      commentsCount
                    }
                  };
                }
              });
            }}
            subscribePostLikeCountChanged={() => {
              subscribeToMore({
                document: POST_LIKE_COUNT_CHANGED,
                variables: { id },
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }

                  // TODO: rethink
                  const token = getAccessToken();
                  let currentId = null;

                  if (token) {
                    currentId = JSON.parse(atob(token.split('.')[1])).userId;
                  }

                  const likeData = subscriptionData.data.postLikeCountChanged;

                  return {
                    ...prev,
                    post: {
                      ...prev.post,
                      liked:
                        likeData.userId === currentId
                          ? likeData.liked
                          : prev.post.liked,
                      likesCount: likeData.count
                    }
                  };
                }
              });
            }}
          >
            {children}
          </PostProviderInner>
        );
      }}
    </Query>
  );
};
export default PostProvider;
