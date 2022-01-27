import React, { useState, useEffect, useContext } from 'react';
import Button from 'components/atoms/button/Button';
import Icon from 'components/atoms/icons/icon';
import { postToEvent, getMemberAssociatedWithToken } from 'utils/api';
import styles from './postInput.module.scss';
import default_picture from 'assets/default_picture.png';
import Modal, { ModalContext } from 'components/atoms/modal/Modal';

const InputButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.pictureContainer}>
        <div className={styles.pictureWrapper}>
          <img src={default_picture} />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={onClick}>Legg til en kommentar</button>
      </div>
    </div>
  );
};

const PostInputField: React.FC<{ eid: string }> = ({ eid }) => {
  const [postText, setPostText] = useState('');
  const [ name, setName ] = useState('');
  const closeModal = useContext(ModalContext);

  const handlePost = async () => {
    try {
      console.log(postText);
      await postToEvent(eid, { message: postText });
      setPostText('');
      closeModal();
    } catch (error) {
      console.log(error.statusCode);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(e.target.value);
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      handlePost();
    }
  };

  const getUserInfo = async () => {
    try{
      const { realName } = await getMemberAssociatedWithToken();
      setName(realName);
    } catch (error) {
      console.log(error.statusCode);
    }
  }

  useEffect(() => {
    getUserInfo()
  })

  return (
    <div className={styles.modalInputContainer}>
      <div className={styles.modalInputWrapper}>
        <div className={styles.modalPostDisplay}>
          <div className={styles.header}>
            <div className={styles.headerText}>
              <p>Opprett et innlegg!</p>
            </div>
            <span className={styles.exitIcon}>
              <Icon type={'times'} size={2.5} onClick={() => closeModal()} />
            </span>
          </div>
          <div className={styles.userHeader}>
            <div className={styles.userPictureContainer}>
              <div className={styles.pictureWrapper}>
                <img src={default_picture} />
              </div>
            </div>
            <div className={styles.userInfo}>{name}</div>
          </div>
          <div className={styles.input}>
            <textarea
              placeholder={'Skriv noe ...'}
              onKeyDown={onEnterPress}
              onChange={handleTextChange}
            />
          </div>
          <div className={styles.publishBtn}>
            <Button version="secondary"> Publiser </Button>
          </div>
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
          <div>
            <PostInputField eid={eid} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PostInput;
