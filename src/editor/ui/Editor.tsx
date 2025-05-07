import React, {type JSX, useEffect, useRef, useState} from "react";
import { EditorClass } from "../model/EditorClass.ts";
import { HeadingBlock } from "../../blocks/HeadingBlock/model/HeadingBlock.ts";
import { ParagraphBlock } from "../../blocks/ParagraphBlock/model/ParagraphBlock.ts";


const editorInstance = new EditorClass();

export const Editor: React.FC = () => {
    const [editor] = useState(editorInstance);
    const [, forceRender] = useState({}); // трюк для принудительного рендера
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
            onInput={() => {
                if (editorRef.current) editor.handleInput(editorRef.current);
            }}
            onSelect={(e) => editor.handleSelect(e)}
            className="border p-4 space-y-4"
        >
            {editor.blocks.map((block) => {
                if (block instanceof HeadingBlock) {
                    const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
                    return (
                        <Tag
                            key={block.id}
                            data-block-id={block.id}
                            className="block"
                            dangerouslySetInnerHTML={{ __html: block.text }}
                        />
                    );
                }

                if (block instanceof ParagraphBlock) {
                    return (
                        <div
                            key={block.id}
                            data-block-id={block.id}
                            className="block"
                            dangerouslySetInnerHTML={{ __html: block.text }}
                        />
                    );
                }

                return null;
            })}
        </div>
    );
};
