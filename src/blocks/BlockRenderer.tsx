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
                key={block.id}
                {...commonProps}
                dangerouslySetInnerHTML={{ __html: block.text }}
            />
        );
    }

    if (block instanceof HeadingBlock) {
        const Tag = block.getTag();
        return (
            <Tag
                key={block.id}
                {...commonProps}
                dangerouslySetInnerHTML={{ __html: block.text }}
            />
        );
    }

    if (block instanceof BulletListBlock) {
        return (
            <ul key={block.id + "_ul"} data-block-id={block.id} style={{ paddingLeft: "20px" }}>
                {block.children.map((child) => (
                    <li key={child.id + "_li"}>
                        <BlockRenderer block={child} />
                    </li>
                ))}
            </ul>
        );
    }

    if (block instanceof NumberedListBlock) {
        return (
            <ol key={block.id + "_ol"} data-block-id={block.id} style={{ paddingLeft: "20px" }}>
                {block.children.map((child) => (
                    <li key={child.id + "_li"}>
                        <BlockRenderer block={child} />
                    </li>
                ))}
            </ol>
        );
    }

    if (block instanceof CheckboxListBlock) {
        return (
            <ul key={block.id + "_checkbox_ul"} data-block-id={block.id} id={block.id} style={{ paddingLeft: "0" }}>
                {block.children.map((child) => (
                    <li
                        key={child.id + "_li"}
                        style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "flex-start",
                        }}
                    >
                        <span
                            key={child.id + "_checkbox"}
                            contentEditable={false}
                            style={{
                                marginTop: "1rem",
                            }}
                        >
                            <input type="checkbox" />
                        </span>
                        <div key={child.id + "_wrapper"} style={{ flex: 1 }}>
                            <BlockRenderer block={child} />
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    return null;
};
