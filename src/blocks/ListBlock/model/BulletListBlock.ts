import { BaseBlock } from "../../BaseBlock/model/BaseBlock.ts";
import type {Block} from "../../types.ts";
import type {ListBlockData} from "./types.ts";

export class BulletListBlock extends BaseBlock {
    children: Block[];

    constructor(id: string, children:Block[] = []) {
        super({ id });
        this.children = children;
    }

    addChild(block: Block) {
        this.children.push(block);
    }

    setChildren(children: Block[]) {
        this.children = children;
    }

    toData(): ListBlockData {
        return {
            id: this.id,
            type: "bullet-list",
            items: this.children.map(child => child.toData()),
        };
    }
    onKeyDown(event) {
    }

    onFocus() {
    }

}
