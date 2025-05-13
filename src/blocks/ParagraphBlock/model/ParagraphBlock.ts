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

   async delete() {
        const blocks = [...this.editor!.initialBlocks];
        const index = blocks.findIndex((block) => block.id === this.id);
        if (index !== -1) {
            blocks.splice(index, 1);
        }
        setBlocks(blocks);
        await this.editor!.forceUpdateBlocks();
    }

    async onKeyDown(event: KeyboardEvent): Promise<void> {
        if (event.key === "Enter") {
            event.preventDefault();

            const data = this.spitterBlock();
            if (data) {
                const clean = (str: string) => str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

                if (!clean(data.leftContent) && !clean(data.rightContent)) {
                    await this.delete();
                    return;
                }

                const leftBlock: BlockData = {
                    id: nanoid(),
                    type: "paragraph",
                    text: data.leftContent || "\u200B",
                    parentId: this.parentId
                };
                const rightBlock: BlockData = {
                    id: nanoid(),
                    type: "paragraph",
                    text: data.rightContent || "\u200B",
                    parentId: this.parentId
                };

                const blocks = [...this.editor!.initialBlocks];
                const index = blocks.findIndex((block) => block.id === this.id);

                if (index !== -1) {
                    // Удаляем текущий блок
                    blocks.splice(index, 1, leftBlock, rightBlock);
                }
                setBlocks(blocks);
                await this.editor!.forceUpdateBlocks()

                const paragraphBlock = document.getElementById(rightBlock.id) as HTMLParagraphElement;
                const range = document.createRange();
                const selection = window.getSelection();
                if (paragraphBlock?.firstChild && selection) {
                    range.setStart(paragraphBlock.firstChild, 0);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }

        }
    }


    override onFocus(): void {
        console.log("Paragraph focused");
    }
}
