import type { Block, BlockData } from "../../blocks/types.ts";
import { HeadingBlock } from "../../blocks/HeadingBlock/model/HeadingBlock.ts";
import { ParagraphBlock } from "../../blocks/ParagraphBlock/model/ParagraphBlock.ts";
import { BulletListBlock } from "../../blocks/ListBlock/model/BulletListBlock.ts";
import { NumberedListBlock } from "../../blocks/ListBlock/model/NumberedListBlock.ts";
import { CheckboxListBlock } from "../../blocks/ListBlock/model/CheckboxListBlock.ts";
import type { EditorClass } from "./EditorClass.ts";

export function createBlockFromData(
    data: BlockData,
    editor: EditorClass,
    index: Map<string, Block> = new Map()
): Block {
    let block: Block;

    if (data.type === "heading") {
        block = new HeadingBlock(data);
    } else if (data.type === "paragraph") {
        block = new ParagraphBlock(data);
    } else if (data.type === "bullet-list") {
        const children = data.items.map(item => createBlockFromData(item, editor, index));
        block = new BulletListBlock(data.id, children);
    } else if (data.type === "numbered-list") {
        const children = data.items.map(item => createBlockFromData(item, editor, index));
        block = new NumberedListBlock(data.id, children);
    } else if (data.type === "checkbox-list") {
        const children = data.items.map(item => createBlockFromData(item, editor, index));
        block = new CheckboxListBlock(data.id, children);
    } else {
        throw new Error(`Unknown block type: ${data}`);
    }

    if (editor) {
        block.attachEditor(editor);
    }

    index.set(block.id, block);

    return block;
}
