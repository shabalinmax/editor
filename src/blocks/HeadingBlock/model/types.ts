import type {HTMLText} from "../../BaseBlock/model/types.ts";

export interface HeadingBlockData {
    type: "heading";
    level: 1 | 2 | 3;
    id: string;
    text: HTMLText;
}
