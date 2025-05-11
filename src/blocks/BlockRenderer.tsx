import React, { useRef } from "react";
import { HeadingBlock } from "./HeadingBlock/model/HeadingBlock.ts";
import { ParagraphBlock } from "./ParagraphBlock/model/ParagraphBlock.ts";
import { BulletListBlock } from "./ListBlock/model/BulletListBlock.ts";
import { NumberedListBlock } from "./ListBlock/model/NumberedListBlock.ts";
import { CheckboxListBlock } from "./ListBlock/model/CheckboxListBlock.ts";
import type { Block } from "./types.ts";

interface Props {
    block: Block;
}

export const BlockRenderer: React.FC<Props> = ({ block }) => {
    const ref = useRef<HTMLDivElement>(null);
    const commonProps = {
        ref,
        id: block.id,
        'data-block-id': block.id,
        contentEditable: true,
        suppressContentEditableWarning: true,

    };

    if (block instanceof ParagraphBlock) {
        const Tag = block.getTag();
        return (
            <Tag
                {...commonProps}
                dangerouslySetInnerHTML={{ __html: block.text }}
            />
        );
    }

    if (block instanceof HeadingBlock) {
        const Tag = block.getTag() ;
        return (
            <Tag
                {...commonProps}
                dangerouslySetInnerHTML={{ __html: block.text }}
            />
        );
    }

    if (block instanceof BulletListBlock) {
        return (
            <ul data-block-id={block.id} style={{ paddingLeft: "20px" }}>
                {block.children.map((child) => (
                    <li key={child.id}>
                        <BlockRenderer block={child} />
                    </li>
                ))}
            </ul>
        );
    }

    if (block instanceof NumberedListBlock) {
        return (
            <ol data-block-id={block.id} style={{ paddingLeft: "20px" }}>
                {block.children.map(child => (
                    <li key={child.id}>
                        <BlockRenderer block={child} />
                    </li>
                ))}
            </ol>
        );
    }

    if (block instanceof CheckboxListBlock) {
        return (
            <ul data-block-id={block.id} style={{ paddingLeft: "20px" }}>
                {block.children.map(child => (
                    <li key={child.id} style={{ display: "flex", alignItems:"center"}}>
                        <div
                            contentEditable={false}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "16px",
                                height: "16px",
                                border: "1px solid #ccc",
                                borderRadius: "3px",
                                backgroundColor: "#fff",
                                marginRight: "10px",
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                        />
                        <BlockRenderer block={child} />
                    </li>
                ))}
            </ul>
        );
    }

    return null;
};
