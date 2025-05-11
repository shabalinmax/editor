import type {BlockData} from "../../types.ts";

export interface ListBlockData {
    id: string;
    type: "bullet-list" | "numbered-list" | "checkbox-list";
    items: BlockData[];
}
