import React, { useState, useEffect } from 'react';
import styles from './eventPost.module.scss'
import PostInput from 'components/molecules/Event/PostInput/PostInput';
import EventPostCard from 'components/molecules/Event/EventPostCard/EventPostsCard';
import { Post } from 'models/apiModels';
import { getEventPosts } from 'utils/api';

const PostField: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <div className={styles.posts}>
      {posts.length && ( <p>Nylig aktivitet</p> )}
      {posts.map((post) => (
        <div key={post.id} className={styles.post}>
          <EventPostCard {...post} />
        </div>
      ))}
    </div>
  );
};

const EventPosts: React.FC<{ eid: string }> = ({ eid }) => {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);

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
