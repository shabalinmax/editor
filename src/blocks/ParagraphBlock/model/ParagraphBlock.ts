import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {ParagraphBlockData} from "./types.ts";

export class ParagraphBlock extends BaseBlock {
    static fromData(data: ParagraphBlockData): ParagraphBlock {
        return new ParagraphBlock({
            id: data.id,
            text: data.text
        });
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
        }
    }

    override onFocus(): void {
        super.onFocus();
        console.log("Paragraph focused");
    }
}
