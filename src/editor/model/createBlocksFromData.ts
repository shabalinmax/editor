import type {Block, BlockData} from "../../blocks/types.ts";
import {HeadingBlock} from "../../blocks/HeadingBlock/model/HeadingBlock.ts";
import {ParagraphBlock} from "../../blocks/ParagraphBlock/model/ParagraphBlock.ts";
import {BulletListBlock} from "../../blocks/ListBlock/model/BulletListBlock.ts";
import {NumberedListBlock} from "../../blocks/ListBlock/model/NumberedListBlock.ts";
import {CheckboxListBlock} from "../../blocks/ListBlock/model/CheckboxListBlock.ts";
import type {EditorClass} from "./EditorClass.ts";

export function createBlockFromData(
    data: BlockData,
    editor: EditorClass,
    index: Map<string, Block>,
    parentId: string | null,
    allData: BlockData[],
): Block {
    let block: Block;

    // Фильтруем дочерние блоки для рекурсии
    const childrenData = allData.filter(child => child.parentId === data.id);

    switch (data.type) {
        case "heading":
            block = new HeadingBlock({...data, parentId});
            break;

        case "paragraph":
            block = new ParagraphBlock({...data, parentId});
            break;

        case "bullet-list": {
            const bulletChildren = childrenData.map(child =>
                createBlockFromData(child, editor, index, data.id, allData),
            );
            block = new BulletListBlock({id: data.id, children: bulletChildren, parentId});
            break;
        }

        case "numbered-list": {
            const numberedChildren = childrenData.map(child =>
                createBlockFromData(child, editor, index, data.id, allData),
            );
            block = new NumberedListBlock({id: data.id, children: numberedChildren, parentId});
            break;
        }

        case "checkbox-list": {
            const checkboxChildren = childrenData.map(child =>
                createBlockFromData(child, editor, index, data.id, allData),
            );
            block = new CheckboxListBlock({id: data.id, children: checkboxChildren, parentId});
            break;
        }

        default:
            throw new Error(`Unknown block type: ${(data as any).type}`);
    }

    if (editor) {
        block.attachEditor(editor);
    }

    index.set(block.id, block);

    return block;
}
