import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {ParagraphBlockData} from "./types.ts";
import {nanoid} from "nanoid";
import {setBlocks} from "../../../editor/model/EditorClass.ts";
import type {BlockData} from "../../types.ts";

export class ParagraphBlock extends BaseBlock {
    text: string
    parentId: string | null;

    constructor({id, text, parentId}: { id: string, text: string, parentId: string | null }) {
        super({id});
        this.text = text;
        this.parentId = parentId;
    }

    getTag() {
        return 'p' as const;
    }

    static fromData(data: ParagraphBlockData): ParagraphBlock {
        return new ParagraphBlock({
            id: data.id,
            text: data.text,
            parentId: data.parentId
        });
    }

    updateText(text: string) {
        this.text = text;
    }

    toData(): ParagraphBlockData {
        return {
            id: this.id,
            type: "paragraph",
            text: this.text,
            parentId: this.parentId
        };
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.preventDefault();

            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            const ref = document.getElementById(this.id);
            if (!ref || !this.editor) return;

            // Получаем левую часть: от начала элемента до начала выделения
            const rangeLeft = document.createRange();
            rangeLeft.selectNodeContents(ref);
            rangeLeft.setEnd(range.startContainer, range.startOffset);

            const fragmentLeft = rangeLeft.cloneContents();
            const divLeft = document.createElement("div");
            divLeft.appendChild(fragmentLeft);
            const leftContent = divLeft.innerHTML;
            console.log("Left content:", leftContent);

            // Получаем правую часть: от конца выделения до конца элемента
            const rangeRight = document.createRange();
            rangeRight.selectNodeContents(ref);
            rangeRight.setStart(range.endContainer, range.endOffset);

            const fragmentRight = rangeRight.cloneContents();
            const divRight = document.createElement("div");
            divRight.appendChild(fragmentRight);
            const rightContent = divRight.innerHTML;
            console.log("Right content:", rightContent);

            // const leftBlock = new ParagraphBlock({
            //     id: nanoid(),
            //     text: rightContent,
            //     parentId: this.parentId,
            // });
            // const rightBlock = new ParagraphBlock({
            //     id: nanoid(),
            //     text: leftContent,
            //     parentId: this.parentId
            // })
            const leftBlock: BlockData = {id: nanoid(), type: "paragraph", text: leftContent, parentId: this.parentId};
            const rightBlock: BlockData = {
                id: nanoid(),
                type: "paragraph",
                text: rightContent,
                parentId: this.parentId
            };


            const blocks: BlockData[] = [
                ...this.editor.initialBlocks.filter((block) => block.id !== this.id),
                leftBlock,
                rightBlock,
            ]
            setBlocks(blocks);
            this.editor.forceUpdateBlocks()
        }
    }


    override onFocus(): void {
        console.log("Paragraph focused");
    }
}
