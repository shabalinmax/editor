import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {HeadingBlockData} from "./types.ts";
import {nanoid} from "nanoid";

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
        // Поведение по Enter или Backspace можно добавить позже
    }

    override onFocus(): void {
        console.log(`Heading (h${this.level}) focused`);
    }
}
