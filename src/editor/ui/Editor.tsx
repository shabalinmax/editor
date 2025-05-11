import React, {useEffect, useRef, useState} from "react";
import { EditorClass } from "../model/EditorClass.ts";
import {BlockRenderer} from "../../blocks/BlockRenderer.tsx";


const editorInstance = new EditorClass();

export const Editor: React.FC = () => {
    const [editor] = useState(editorInstance);
    const [, forceRender] = useState({});
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        editor.setOnUpdate(() => {
            forceRender({});
        });
    }, [editor]);
    return (
        <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onBeforeInput={(event) => {
                if (editorRef.current) editor.handleBeforeInput(editorRef.current, event);
            }}
            onKeyDown={(event) => {
                if (editorRef.current) editor.handleKeyDown(editorRef.current, event);
            }}
            onInput={(event) => {
                if (editorRef.current) editor.handleInput(editorRef.current, event);
            }}
            onSelect={(e) => editor.handleSelect(e)}
        >
            {
                editor.blocks.map((block) => {
                    return <BlockRenderer block={block}/>
                })
            }
        </div>
    );
};
