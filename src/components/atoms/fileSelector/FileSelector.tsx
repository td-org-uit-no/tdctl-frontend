import React, { InputHTMLAttributes, useRef, useState } from 'react';
import './fileSelector.scss';

interface IFileSelector extends InputHTMLAttributes<HTMLInputElement> {
  setFile: (file: File) => void;
  text: string;
  fileValidator?: (file: File) => string | undefined;
}

const FileSelector: React.FC<IFileSelector> = ({
  setFile,
  text,
  fileValidator,
  ...rest
}) => {
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  // remove type from rest to ensure type="file"
  const { type, ...filteredProps } = rest;

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files == null || !event.target.files?.length) {
      // catch file selector opened but no file selected
      return;
    }
    const file = event.target.files[0];
    const validatorError = fileValidator && fileValidator(file);

    if (validatorError) {
      setErrorMsg(validatorError);
      resetInputValue();
      return;
    }
    setErrorMsg(undefined);
    setFile(file);
  }

  function resetInputValue() {
    if (inputRef.current !== null) {
      inputRef.current.value = '';
    }
  }

  return (
    <div className="fileSelector">
      <label>{text}</label>
      <input
        ref={inputRef}
        type="file"
        {...filteredProps}
        onChange={handleFileUpload}
      />
      {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
};

export default FileSelector;
