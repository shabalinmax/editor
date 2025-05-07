import React, {useRef, useEffect} from "react";
import type {JSX} from "react";
import type {BaseBlock} from "./BaseBlock/model/BaseBlock.ts";
import {HeadingBlock} from "./HeadingBlock/model/HeadingBlock.ts";
import {ParagraphBlock} from "./ParagraphBlock/model/ParagraphBlock.ts";

interface Props {
    block: BaseBlock;
}

export const BlockRenderer: React.FC<Props> = ({ block }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleFocus = () => block.onFocus();
        const handleBlur = () => block.onBlur();
        const handleKeyDown = (e: KeyboardEvent) => block.onKeyDown(e);

        el.addEventListener("focus", handleFocus);
        el.addEventListener("blur", handleBlur);
        el.addEventListener("keydown", handleKeyDown);

        return () => {
            el.removeEventListener("focus", handleFocus);
            el.removeEventListener("blur", handleBlur);
            el.removeEventListener("keydown", handleKeyDown);
        };
    }, [block]);

    const commonProps = {
        ref,
        contentEditable: true,
        suppressContentEditableWarning: true,
        dangerouslySetInnerHTML: { __html: block.text },
        className: block.isFocus ? "border-blue-500 border" : "",
    };

    if (block instanceof ParagraphBlock) return <div {...commonProps} />;
    if (block instanceof HeadingBlock) {
        const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
        return React.createElement(Tag, {
            ref: ref,
            contentEditable: true,
            suppressContentEditableWarning: true,
            dangerouslySetInnerHTML: { __html: block.text },
            className: block.isFocus ? "border-blue-500 border" : "",
        });
    }

    return null;
};
