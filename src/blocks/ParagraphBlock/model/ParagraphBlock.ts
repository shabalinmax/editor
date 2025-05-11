import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {ParagraphBlockData} from "./types.ts";

export class ParagraphBlock extends BaseBlock {
    text: string

    constructor({id, text}: { id: string, text: string }) {
        super({id});
        this.text = text;
    }

    getTag() {
        return 'p' as const;
    }

    static fromData(data: ParagraphBlockData): ParagraphBlock {
        return new ParagraphBlock({
            id: data.id,
            text: data.text
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
        };
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            console.log("New paragraph maybe?");
            event.preventDefault();
        }
    }

    override onFocus(): void {
        console.log("Paragraph focused");
    }
}
