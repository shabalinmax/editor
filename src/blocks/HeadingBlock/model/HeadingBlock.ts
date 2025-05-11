import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {HeadingBlockData} from "./types.ts";
import {nanoid} from "nanoid";
import type {BlockData} from "../../types.ts";
import {setBlocks} from "../../../editor/model/EditorClass.ts";

export class HeadingBlock extends BaseBlock {
    level: 1 | 2 | 3;
    text: string;
    parentId: string | null;

    constructor({text, level, id, parentId}: { text: string, level: 1 | 2 | 3, id?: string, parentId: string | null }) {
        super({
            id: id ?? nanoid(),
        });
        this.text = text;
        this.level = level;
        this.parentId = parentId;
    }

    getTag() {
        return `h${this.level}` as 'h1' | 'h2' | 'h3';
    }

    static fromData(data: HeadingBlockData): HeadingBlock {
        return new HeadingBlock({
            id: data.id,
            text: data.text,
            level: data.level,
            parentId: data.parentId
        });
    }

    toData(): HeadingBlockData {
        return {
            type: "heading",
            level: this.level,
            text: this.text,
            id: this.id,
            parentId: this.parentId
        };
    }

    updateText(text: string) {
        this.text = text;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            event.preventDefault();

            const data = this.spitterBlock();
            if (data) {
                const leftBlock: BlockData = {
                    id: nanoid(),
                    level: this.level,
                    type: "heading",
                    text: data.leftContent,
                    parentId: this.parentId
                };
                const rightBlock: BlockData = {
                    id: nanoid(),
                    level: this.level,
                    type: "heading",
                    text: data.rightContent,
                    parentId: this.parentId
                };


                const blocks = [...this.editor!.initialBlocks];
                const index = blocks.findIndex((block) => block.id === this.id);

                if (index !== -1) {
                    // Удаляем текущий блок
                    blocks.splice(index, 1, leftBlock, rightBlock);
                }

                setBlocks(blocks);
                this.editor!.forceUpdateBlocks()
            }

        }
    }

    override onFocus(): void {
        console.log(`Heading (h${this.level}) focused`);
    }
}
