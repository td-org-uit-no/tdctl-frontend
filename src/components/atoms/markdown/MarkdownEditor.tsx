import React, { useState, ChangeEvent, TextareaHTMLAttributes, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from '../textarea/textarea.module.scss';
import { Button, Stack } from '@chakra-ui/react'
import { MdInsertLink , MdFormatBold, MdFormatItalic } from "react-icons/md"


interface MarkdownEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    maxWidth?: number;
    minWidth?: number;
    error?: string[] | undefined;
    resize?: boolean;
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
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    // 2 is textarea default value for rows
    const [rows, setRows] = useState(2);
    const [view, setShowPreview] = useState(false); // Add state variable for toggle

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
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

    const showEditor = () => {
        setShowPreview(false);
    };
    const showPreview = () => {
        setShowPreview(true);
    };

    
    const insertLink = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "[Display text](URL)"
        if (textarea !== null){
            let position = textarea.selectionStart;
            const end = position + text.length;
            textarea.setRangeText(text, position, end, 'select');
        }
    };
    const insertBold = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "**Text**"
        if (textarea !== null){
            let position = textarea.selectionStart;
            const end = position + text.length;
            textarea.setRangeText(text, position, end, 'select');
        }
    };
    const insertItalic = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "[Display text](URL)"
        if (textarea !== null){
            let position = textarea.selectionStart;
            const end = position + text.length;
            textarea.setRangeText(text, position, end, 'select');
        }
    };
    const insertHeader = () => {
        const textarea = document.getElementById('myEditor') as HTMLTextAreaElement;
        const text = "[Display text](URL)"
        if (textarea !== null){
            let position = textarea.selectionStart;
            const end = position + text.length;
            textarea.setRangeText(text, position, end, 'select');
        }
    };

    

    return (
        <div className={styles.container}>
            <Stack direction='row' spacing={4}>
                <Button size='xs' colorScheme='purple' variant={view ? ('outline'):('solid')} onClick={showEditor}>
                    Write
                </Button>
                <Button size='xs' colorScheme='purple' variant={view ? ('solid'):('outline')} onClick={showPreview}>
                    Preview
                </Button>
                <Button size='xs' rightIcon={<MdInsertLink/>} colorScheme='purple' variant='outline' onClick={insertLink}>
                    Link
                </Button>
                <Button size='xs' colorScheme='purple' variant='outline' onClick={insertBold}>B</Button>
            </Stack>
            {view ? ( // Conditionally render markdown or preview based on toggle state
                <ReactMarkdown>{input}</ReactMarkdown>
            ) : <div className={styles.inputContainer}>
                    <textarea
                        id='myEditor'
                        style={{
                            maxWidth: maxWidth ? maxWidth + 'ch' : '',
                            minWidth: minWidth ? minWidth + 'ch' : '',
                        }}
                        rows={rows}
                        className={styles.text}
                        // onFocus={() => setIsFocused(true)}
                        // onBlur={() => setIsFocused(false)}
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Beskrivelse"
                        // cols={50}
                        />
                </div> }
            

            
            {/* {label && <label className={getLabelStyle()}>{label}</label>} */}
        </div>
    );
};

export default MarkdownEditor;