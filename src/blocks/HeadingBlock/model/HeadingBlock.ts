import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {HeadingBlockData} from "./types.ts";
import {nanoid} from "nanoid";

export class HeadingBlock extends BaseBlock {
    level: 1 | 2 | 3;

    constructor({ text, level, id}: {text: string, level: 1 | 2 | 3, id?: string}) {
        super({
            id: id ?? nanoid(),
            text
        });
        this.level = level;
    }

    static fromData(data: HeadingBlockData): HeadingBlock {
        return new HeadingBlock({
            id: data.id,
            text: data.text,
            level: data.level
        });
    }

    toData(): HeadingBlockData {
        return {
            type: "heading",
            level: this.level,
            text: this.text,
            id: this.id,
        };
    }

    onKeyDown(event: KeyboardEvent): void {
        // Поведение по Enter или Backspace можно добавить позже
    }

    override onFocus(): void {
        console.log(`Heading (h${this.level}) focused`);
    }
}
