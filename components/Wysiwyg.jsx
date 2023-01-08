import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const Wysiwyg = ({ content, setContent }) => {
	const editor = useRef(null);
    
    
	return (
		<div>
            <JoditEditor
			    ref={editor}
                value={content}
                tabIndex={1} // tabIndex of textarea
			    onBlur={(newContent) => setContent(newContent)}
		    />
        </div>
	);
};
export default Wysiwyg;