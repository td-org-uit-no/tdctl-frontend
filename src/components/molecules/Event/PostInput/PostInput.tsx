import React, { useState } from 'react';
import styles from './postInput.module.scss';
import default_picture from 'assets/default_picture.png';
import Modal from 'components/atoms/modal/Modal';
import PostInputField from './PostInputField/PostInputField';
import Button from 'components/atoms/button/Button';

const InputButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <div className={styles.pictureContainer}>
          <div className={styles.pictureWrapper}>
            <img src={default_picture} />
          </div>
        </div>
          <div className={styles.userInfo}>
            <Button version="secondary" onClick={onClick}> Legg til et innlegg! </Button>
          </div>
      </div>
    </div>
  );
};

const PostInput: React.FC<{ eid: string }> = ({ eid }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.commentContainer}>
      <div className={styles.commentWrapper}>
        <InputButton
          onClick={() => {
            setOpen(true);
          }}
        />
        <Modal open={open} closeModal={() => setOpen(false)}>
          <PostInputField eid={eid} />
        </Modal>
      </div>
    </div>
  );
};

export default PostInput;
