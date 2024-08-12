import React, { useState, ChangeEvent, TextareaHTMLAttributes, useEffect, Suspense} from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './markdown.module.scss';
import { Button, Stack } from '@chakra-ui/react'
import { MdInsertLink , MdFormatBold, MdFormatItalic } from "react-icons/md"
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
// const Lazycomponent = lazy(() => import('emoji-picker-react'))


const Lazycomponent = React.lazy(() =>
  import("emoji-picker-react").then(module => {
    return { default: module.default };
  })
);


interface MarkdownEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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
    const [input, setInput] = useState(value ? value : "");
    // const [input, setInput] = useState(value);
    const [isFocused, setIsFocused] = useState(false);
    // 2 is textarea default value for rows
    const [rows, setRows] = useState(2);
    const [view, setShowPreview] = useState(false); // Add state variable for toggle
    const [showEmoji, setShowEmoji] = useState(false);

    // const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    //     setInput(event.target.value);
    // };

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

    
    const insertLink = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "[Display text](URL)"
        if (textarea !== null){
            const position = textarea.selectionStart;
            // const end = position + text.length;
            // textarea.setRangeText(text, position, end, 'select');
            const before = textarea.value.substring(0, position);
            const after = textarea.value.substring(position, textarea.value.length);

            // Insert the new text at the cursor position
            textarea.value = before + text + after;
            setInput(textarea.value)
            textarea.selectionStart = textarea.selectionEnd = position + text.length-1;
        }
    };
    const insertBold = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "****"
        if (textarea !== null){
            const position = textarea.selectionStart;
            const before = textarea.value.substring(0, position);
            const after = textarea.value.substring(position, textarea.value.length);

            // Insert the new text at the cursor position
            textarea.value = before + text + after;
            setInput(textarea.value)
            textarea.selectionStart = textarea.selectionEnd = position + text.length-2;
        }
    };
    const insertItalic = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "**"
        if (textarea !== null){
            const position = textarea.selectionStart;
            const before = textarea.value.substring(0, position);
            const after = textarea.value.substring(position, textarea.value.length);

            // Insert the new text at the cursor position
            textarea.value = before + text + after;
            setInput(textarea.value)
            textarea.selectionStart = textarea.selectionEnd = position + text.length-1;
        }
    };
    const insertHeader = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "### "
        if (textarea !== null){
            const position = textarea.selectionStart;
            const before = textarea.value.substring(0, position);
            const after = textarea.value.substring(position, textarea.value.length);

            // Insert the new text at the cursor position
            textarea.value = before + text + after;
            setInput(textarea.value)
            textarea.selectionStart = textarea.selectionEnd = position + text.length;
        }
    };

    const onClickEmoji = (EmojiObject: EmojiClickData) => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        if (textarea !== null){
            const position = textarea.selectionStart;
            const before = textarea.value.substring(0, position);
            const after = textarea.value.substring(position, textarea.value.length);

            // Insert the new text at the cursor position
            textarea.value = before + EmojiObject.emoji + after;
            setInput(textarea.value)
            textarea.selectionStart = textarea.selectionEnd = position + EmojiObject.emoji.length;
        }
    };

    

    return (
        <div className={styles.markdown_container}>

            

            <div className={styles.fuck}>
                <Stack direction='row' spacing={2} justify={'space-between'}>
                    <Button size='xs' colorScheme='purple' variant={view ? ('outline'):('solid')} onClick={() => setShowPreview(false)}>
                        Write
                    </Button>
                    <Button size='xs' colorScheme='purple' variant={view ? ('solid'):('outline')} onClick={() => setShowPreview(true)}>
                        Preview
                    </Button>
                    <Button size='xs' rightIcon={<MdInsertLink/>} colorScheme='purple' variant='outline' onClick={insertLink}>
                        Link
                    </Button>
                    <Button size='xs' colorScheme='purple' variant='outline' onClick={insertBold}>B</Button>
                    <Button size='xs' colorScheme='purple' variant='outline' onClick={insertItalic}>Italic</Button>
                    <Button size='xs' colorScheme='purple' variant='outline' onClick={insertHeader}>H</Button>
                    <Button size='xs' colorScheme='purple' variant={showEmoji ? 'solid' : 'outline'} onClick={() =>setShowEmoji(!showEmoji)}>Emoji</Button>
                </Stack>

            </div>
            <div className={styles.container}>
                {/* <Stack direction='row' spacing={2} justify={'end'}>
                </Stack> */}

                {view ? ( // Conditionally render markdown or preview based on toggle state
                    <ReactMarkdown className={styles.preview}>{input}</ReactMarkdown>
                    ) : (<div className={styles.inputContainer}>
                        <textarea
                            id='myEditor'
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
                            // placeholder="Beskrivelse"
                            // cols={50}
                            {...rest}
                            />
                    </div>)
                }
                {label && <label className={getLabelStyle()}>{label}</label>}
                

                
                {showEmoji ? (
                    <div style={{display: 'flex'}}>
                        <EmojiPicker onEmojiClick={onClickEmoji} />
                    </div>) : (
                    <div style={{display: 'none'}}>
                        <EmojiPicker onEmojiClick={onClickEmoji} />
                    </div>)
                }

                
                {/* <Suspense fallback={<div>Loading...</div>}>
                    <Lazycomponent/>
                </Suspense> */}
                

                {error && (
                    <div className={styles.errors}>
                    {error.map((err, index: number) =>
                        error.length > 1 ? <li key={index}>{err}</li> : err
                    )}
                    </div>
                )}
                
            </div>
            {/* <Suspense fallback={<div>Loading...</div>}>
                <Lazycomponent/>
            </Suspense> */}
        </div>
    );
};

export default MarkdownEditor;