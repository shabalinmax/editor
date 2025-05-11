import type {Block, BlockData} from "../../types.ts";
import {BaseBlock} from "../../BaseBlock/model/BaseBlock.ts";
import type {KeyboardEvent} from "react";

export class CheckboxListBlock extends BaseBlock {
    children: Block[];

    constructor(id: string, children: Block[] = []) {
        super({id});
        this.children = children;
    }

    toData(): BlockData {
        return {
            id: this.id,
            type: "checkbox-list",
            items: this.children.map(child => child.toData()),
        };
    }
    onKeyDown(event: KeyboardEvent) {
    }
    onFocus() {
    }
}

