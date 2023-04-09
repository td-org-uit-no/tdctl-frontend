import React, { useEffect, useState } from 'react';
import './reupload.scss';
import FileSelector from 'components/atoms/fileSelector/FileSelector';
import ConfirmationBox from 'components/molecules/confirmationBox/ConfirmationBox';
import Modal from 'components/molecules/modal/Modal';
import useModal from 'hooks/useModal';
import { useToast } from 'hooks/useToast';
import { useHistory } from 'react-router-dom';
import { PNGImageValidator } from 'utils/validators';

interface IReuploadImageModal {
  title: string;
  id: string | undefined;
  shouldOpen: boolean;
  prefix: string;
  textOnFinish: string;
  uploadFunction: (id: string, file: File) => Promise<void>;
}

const ReuploadImageModal: React.FC<IReuploadImageModal> = ({
  title,
  id,
  shouldOpen,
  prefix,
  textOnFinish,
  uploadFunction,
}) => {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>(undefined);
  const { addToast } = useToast();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useModal();

  const reuploadImage = async (id: string) => {
    if (!file) {
      setError('Bildefil ikke valgt');
      return;
    }
    setError('');
    try {
      await uploadFunction(id, file);
    } catch (error) {
      addToast({
        title: 'Feil ved opplasting av bilde',
        status: 'error',
        description: 'prøv på nytt',
      });
      return;
    }
    redirAndDisplayFeedback();
  };

  const redirAndDisplayFeedback = () => {
    // give feedback that the "type" is created as the form feedback will not be displayed
    // since we redirect from this component
    addToast({
      title: 'Suksess',
      status: 'success',
      description: `${textOnFinish}`,
    });
    history.push(`${prefix}/${id}`);
  };

  useEffect(() => {
    if (shouldOpen) {
      onOpen();
    }
  }, [shouldOpen]);

  useEffect(() => {
    if (!isOpen && id !== undefined) {
      // display feedback on close. has to ensure that id is defined so it does not
      // trigger before being displayed
      redirAndDisplayFeedback();
      return;
    }
  }, [isOpen]);

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      {id !== undefined && (
        <div className="imgReupload">
          <FileSelector
            setFile={setFile}
            text="En feil skjedde ved opplasting av bilde, prøv på nytt her."
            accept="image/png"
            fileValidator={PNGImageValidator}
          />
          <ConfirmationBox
            confirmText="Last opp på nytt"
            declineText="Opprett uten bilde"
            onAccept={() => {
              reuploadImage(id);
            }}
            onDecline={() => {
              onClose();
              redirAndDisplayFeedback();
            }}
          />
          {error && <p>{error}</p>}
        </div>
      )}
    </Modal>
  );
};

export default ReuploadImageModal;
