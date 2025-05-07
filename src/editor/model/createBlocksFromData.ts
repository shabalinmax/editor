import type { BlockData } from "../../blocks/types.ts";
import { HeadingBlock } from "../../blocks/HeadingBlock/model/HeadingBlock.ts";
import { ParagraphBlock } from "../../blocks/ParagraphBlock/model/ParagraphBlock.ts";
import type { EditorClass } from "./EditorClass.ts";

export function createBlockFromData(data: BlockData, editor: EditorClass) {
    let block;

    if (data.type === "heading") {
        block = new HeadingBlock(data);
    } else if (data.type === "paragraph") {
        block = new ParagraphBlock(data);
    } else {
        throw new Error(`Unknown block type: ${data}`);
    }

    if (editor) {
        block.attachEditor(editor);
    }

    return block;
}
