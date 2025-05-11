import type {Block, BlockData} from "../../types.ts";
import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {KeyboardEvent} from "react";

export class NumberedListBlock extends BaseBlock {
    children: Block[];
    parentId: string | null

    constructor({ id, children, parentId }: { id: string, children: Block[], parentId: string | null }) {
        super({id});
        this.children = children;
        this.parentId = parentId;
    }

    toData(): BlockData {
        return {
            id: this.id,
            type: "numbered-list",
            items: this.children.map(child => child.toData()),
        };
    }
    onKeyDown(event: KeyboardEvent) {
    }
    onFocus() {
    }
}
