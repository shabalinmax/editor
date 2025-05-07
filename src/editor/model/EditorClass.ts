import type { BaseBlock } from "../../blocks/BaseBlock/model/BaseBlock.ts";
import { createBlockFromData } from "./createBlocksFromData.ts";
import type { BlockData } from "../../blocks/types.ts";
import { nanoid } from "nanoid";

type EditorUpdateCallback = () => void;

export class EditorClass {
    blocks: BaseBlock[];
    activeBlockId: string | null = null;
    private updateCallback: EditorUpdateCallback | null = null;

    constructor() {
        const initialData: BlockData[] = [
            { id: nanoid(), type: "heading", level: 1, text: "Welcome to the editor" },
            { id: nanoid(), type: "paragraph", text: "<p>This is a paragraph</p>" },
        ];
        this.blocks = initialData.map((data) => createBlockFromData(data, this));
    }

    setOnUpdate(callback: EditorUpdateCallback) {
        this.updateCallback = callback;
    }

    forceUpdate() {
        this.updateCallback?.();
    }

    setActiveBlock(id: string | null) {
        this.activeBlockId = id;
    }

    updateActiveBlockText(newHTML: string) {
        if (!this.activeBlockId) return;
        const block = this.blocks.find((b) => b.id === this.activeBlockId);
        if (block) {
            block.updateText(newHTML);
        }
    }

    handleSelect(event: Event) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        let node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentElement!;
        }

        const blockEl = (node as HTMLElement).closest("[data-block-id]") as HTMLElement | null;
        const id = blockEl?.dataset.blockId ?? null;
        this.setActiveBlock(id);
    }

    handleInput(containerEl: HTMLElement) {
        const id = this.activeBlockId;
        if (!id) return;

        const blockEl = containerEl.querySelector(`[data-block-id="${id}"]`) as HTMLElement;
        if (blockEl) {
            this.updateActiveBlockText(blockEl.innerHTML);
        }
    }

    toJSON(): BlockData[] {
        return this.blocks.map((block) => block.toData() as BlockData);
    }

    addBlock(block: BaseBlock) {
        this.blocks.push(block);
        this.forceUpdate();
    }

    removeBlock(index: number) {
        this.blocks.splice(index, 1);
        this.forceUpdate();
    }
}