import type {HTMLText} from "../../BaseBlock/model/types.ts";

export interface ParagraphBlockData {
    type: "paragraph";
    id: string;
    text: HTMLText;
}
