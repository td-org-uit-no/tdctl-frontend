import React, { useState, useEffect } from 'react';
import styles from './eventPost.module.scss';
import Button from 'components/atoms/button/Button';
import { postToEvent, getEventPosts } from 'utils/api';
import { Post } from 'models/apiModels';

const EventPosts: React.FC<{ eid: string }> = ({ eid }) => {
  const [posts, setPosts] = useState<Post[] | undefined>(undefined);
  const [postText, setPostText] = useState('');

  const handlePost = async () => {
    try {
      await postToEvent(eid, { message: postText });
      setPostText('');
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const fetchPosts = async () => {
    try {
      const res = await getEventPosts(eid);
      console.log('res ' + res);
      setPosts(res);
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey == false) {
      // e.preventDefault();
      handlePost();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <div className={styles.postContainer}>
      <div className={styles.postHeader}>
        <div className={styles.messageField}>
          <textarea
            placeholder="Skriv en kunngjøring"
            value={postText}
            onChange={handleTextChange}
            onKeyDown={onEnterPress}
          />
        </div>
        <div className={styles.buttonContainer}>
          <div className={styles.button}>
            <Button version="secondary" onClick={handlePost}>
              Post
            </Button>
          </div>
        </div>
      </div>
        {posts?.length && (
          <div>
            {posts.map((post) => (
              <div key={post.id}>message : {post.message}</div>
            ))}
          </div>
        )}
    </div>
  );
};

export default EventPosts;
