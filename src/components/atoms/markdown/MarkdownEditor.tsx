import React, {
  useState,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
} from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './markdown.module.scss';
import {
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { MdInsertLink } from 'react-icons/md';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface MarkdownEditorProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  maxWidth?: number;
  minWidth?: number;
  error?: string[] | undefined;
  resize?: boolean;
  value?: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  error,
  maxWidth,
  minWidth,
  label,
  value,
  resize,
  onChange,
  ...rest
}) => {
  const [input, setInput] = useState(value ? value : '');
  const [isFocused, setIsFocused] = useState(false);
  // 2 is textarea default value for rows
  const [rows, setRows] = useState(2);
  const [view, setShowPreview] = useState(false); // Add state variable for toggle
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleButtonClick = (callback: () => void) => {
    callback();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getLabelStyle = () => {
    return !!input || isFocused
      ? `${styles.label} ${styles.styledLabel}`
      : styles.label;
  };

  useEffect(() => {
    if (!resize) {
      return;
    }
    const rowlen = input ? input.toString().split('\n').length : 2;
    const max = 14;
    setRows(rowlen < max ? rowlen : max);
  }, [input, resize]);

  const insertText = (text: string, offset: number) => {
    const textarea = textareaRef.current;
    if (textarea === null) {
      return;
    }
    const position = textarea.selectionStart;
    const before = textarea.value.substring(0, position);
    const after = textarea.value.substring(position, textarea.value.length);

    // Insert the new text at the cursor position
    textarea.value = before + text + after;
    setInput(textarea.value);
    textarea.selectionStart = textarea.selectionEnd =
      position + text.length - offset;
  };

  const insertLink = () => {
    const text = '[Display text](https://www.example.com)';
    insertText(text, 1);
  };

  const insertBold = () => {
    const text = '****';
    insertText(text, 2);
  };

  const insertItalic = () => {
    const text = '**';
    insertText(text, 1);
  };

  const insertHeader = (level: number) => {
    const text = '#'.repeat(level) + ' ';
    insertText(text, 0);
  };

  const onClickEmoji = (EmojiObject: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (textarea !== null) {
      const position = textarea.selectionStart;
      const before = textarea.value.substring(0, position);
      const after = textarea.value.substring(position, textarea.value.length);

      // Insert the new text at the cursor position
      textarea.value = before + EmojiObject.emoji + after;
      setInput(textarea.value);
      textarea.selectionStart = textarea.selectionEnd =
        position + EmojiObject.emoji.length;
    }
  };

  return (
    <div className={styles.markdownContainer}>
      <div className={styles.buttonContainer}>
        <Stack direction="row" spacing={2} justify={'space-between'}>
          <Button
            size="xs"
            colorScheme="purple"
            variant={view ? 'outline' : 'solid'}
            onClick={() => setShowPreview(false)}>
            Write
          </Button>
          <Button
            size="xs"
            colorScheme="purple"
            variant={view ? 'solid' : 'outline'}
            onClick={() => setShowPreview(true)}>
            Preview
          </Button>
          <Button
            size="xs"
            rightIcon={<MdInsertLink />}
            colorScheme="purple"
            variant="outline"
            onClick={() => handleButtonClick(insertLink)}>
            Link
          </Button>
          <Button
            size="xs"
            colorScheme="purple"
            variant="outline"
            onClick={() => handleButtonClick(insertBold)}>
            B
          </Button>
          <Button
            size="xs"
            colorScheme="purple"
            variant="outline"
            onClick={() => handleButtonClick(insertItalic)}>
            Italic
          </Button>
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="purple"
              size="xs"
              variant="outline">
              H
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => handleButtonClick(() => insertHeader(1))}>
                H1
              </MenuItem>
              <MenuItem
                onClick={() => handleButtonClick(() => insertHeader(2))}>
                H2
              </MenuItem>
              <MenuItem
                onClick={() => handleButtonClick(() => insertHeader(3))}>
                H3
              </MenuItem>
              <MenuItem
                onClick={() => handleButtonClick(() => insertHeader(4))}>
                H4
              </MenuItem>
              <MenuItem
                onClick={() => handleButtonClick(() => insertHeader(5))}>
                H5
              </MenuItem>
              <MenuItem
                onClick={() => handleButtonClick(() => insertHeader(6))}>
                H6
              </MenuItem>
            </MenuList>
          </Menu>
          <Button
            size="xs"
            colorScheme="purple"
            variant={showEmoji ? 'solid' : 'outline'}
            onClick={() => setShowEmoji(!showEmoji)}>
            Emoji
          </Button>
        </Stack>
      </div>
      <div className={styles.container}>
        {label && <label className={getLabelStyle()}>{label}</label>}

        {view ? ( // Conditionally render markdown or preview based on toggle state
          <ReactMarkdown className={styles.preview}>{input}</ReactMarkdown>
        ) : (
          <div className={styles.inputContainer}>
            <textarea
              ref={textareaRef}
              style={{
                maxWidth: maxWidth ? maxWidth + 'ch' : '',
                minWidth: minWidth ? minWidth + 'ch' : '',
              }}
              rows={rows}
              className={styles.text}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                onChange && onChange(e);
              }}
              cols={50}
              {...rest}
            />
          </div>
        )}

        {showEmoji ? (
          <div style={{ display: 'flex' }}>
            <EmojiPicker onEmojiClick={onClickEmoji} />
          </div>
        ) : (
          <div style={{ display: 'none' }}>
            <EmojiPicker onEmojiClick={onClickEmoji} />
          </div>
        )}

        {error && (
          <div className={styles.errors}>
            {error.map((err, index: number) =>
              error.length > 1 ? <li key={index}>{err}</li> : err
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
