import React, { useState, useEffect, useContext } from 'react';
import styles from './eventPost.module.scss'
import PostInput from 'components/molecules/Event/PostInput/PostInput';
import EventPostCard from 'components/molecules/Event/EventPostCard/EventPostsCard';
import { Post } from 'models/apiModels';
import { getEventPosts } from 'utils/api';
import { EventContext } from 'components/pages/events/EventPage/ValidEvent/validEvent';

const PostField: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div className={styles.posts}>
      {posts.map((post) => (
        <div key={post.id} className={styles.post}>
          <EventPostCard {...post} />
        </div>
      ))}
    </div>
  );
};

const EventPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const { eid } = useContext(EventContext);

  const fetchPosts = async () => {
    try {
      const res = await getEventPosts(eid);
      setPosts(res);
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className={styles.postsContainer}>
      <PostInput eid={eid} />
      {posts !== undefined && <PostField posts={posts} />}
    </div>
  );
};

export default EventPosts;
