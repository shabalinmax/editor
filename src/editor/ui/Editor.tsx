import React, {useEffect, useRef, useState} from "react";
import { EditorClass } from "../model/EditorClass.ts";
import {BlockRenderer} from "../../blocks/BlockRenderer.tsx";


const editorInstance = new EditorClass();

export const Editor: React.FC = () => {
    const [editor] = useState(editorInstance);
    const editorRef = useRef<HTMLDivElement>(null);
    const [, setRender] = useState<object>({});
    const resolveRef = useRef<(() => void) | null>(null);
    const promiseRef = useRef<Promise<void> | null>(null);

    const forceRender = () => {
        // Создаем новый промис и сохраняем его резолвер
        promiseRef.current = new Promise<void>((resolve) => {
            resolveRef.current = resolve;
        });
        setRender({}); // Обновляем состояние
        return promiseRef.current;
    };

    // После обновления, вызываем resolve
    useEffect(() => {
        if (resolveRef.current) {
            resolveRef.current();
            resolveRef.current = null;
        }
    });


    useEffect(() => {
        editor.setOnUpdate(async () => {
            forceRender();
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
                    return <BlockRenderer key={block.id + '_blockRender'} block={block}/>
                })
            }
        </div>
    );
};
