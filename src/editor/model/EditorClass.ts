import type { BaseBlock } from "../../blocks/BaseBlock/model/BaseBlock.ts";
import { createBlockFromData } from "./createBlocksFromData.ts";
import type {Block, BlockData} from "../../blocks/types.ts";
import { nanoid } from "nanoid";
import React, {type FormEvent} from "react";
import {createEvent, createStore} from "effector";

// Генерация ID для блоков
const heading1 = nanoid();
const para1 = nanoid();
const heading2 = nanoid();

const list1 = nanoid();
const list1Item1 = nanoid();
const nestedList1 = nanoid();
const nestedList1Item1 = nanoid();
const nestedList1Item2 = nanoid();
const list1Item3 = nanoid();

const list2 = nanoid();
const list2Item1 = nanoid();
const list2Item2 = nanoid();
const nestedList2 = nanoid();
const nestedList2Item1 = nanoid();
const nestedList2Item2 = nanoid();

const checkboxList = nanoid();
const checkboxItem1 = nanoid();
const numberedList = nanoid();
const numberedListItem = nanoid();

// 📦 Плоский список всех блоков
export const initialBlocks = createStore<BlockData[]>([
    { id: heading1, type: "heading", level: 1, text: "Welcome to the editor", parentId: null },
    { id: para1, type: "paragraph", text: "This is a paragraph", parentId: null },
    { id: heading2, type: "heading", level: 1, text: "Nested List Example", parentId: null },

    { id: list1, type: "bullet-list", parentId: null },
    { id: list1Item1, type: "paragraph", text: "First bullet item", parentId: list1 },
    { id: nestedList1, type: "bullet-list", parentId: list1 },
    { id: nestedList1Item1, type: "paragraph", text: "Nested bullet 1", parentId: nestedList1 },
    { id: nestedList1Item2, type: "heading", level: 3, text: "Nested heading in list", parentId: nestedList1 },
    { id: list1Item3, type: "paragraph", text: "Second bullet item", parentId: list1 },

    { id: list2, type: "bullet-list", parentId: null },
    { id: list2Item1, type: "paragraph", text: "First bullet point", parentId: list2 },
    { id: list2Item2, type: "heading", level: 2, text: "Subheading in list", parentId: list2 },
    { id: nestedList2, type: "bullet-list", parentId: list2 },
    { id: nestedList2Item1, type: "paragraph", text: "Nested bullet point", parentId: nestedList2 },
    { id: nestedList2Item2, type: "paragraph", text: "Another nested bullet", parentId: nestedList2 },

    { id: checkboxList, type: "checkbox-list", parentId: null },
    { id: checkboxItem1, type: "paragraph", text: "Checkbox item 1", parentId: checkboxList },
    { id: numberedList, type: "numbered-list", parentId: checkboxList },
    { id: numberedListItem, type: "paragraph", text: "Nested numbered inside checkbox", parentId: numberedList },
]);

export const setBlocks = createEvent<BlockData[]>();

initialBlocks.on(setBlocks, (_, data) => data);


type EditorUpdateCallback = () => Promise<void>;

export class EditorClass {
    blocks: Block[];
    activeBlockId: string | null = null;
    private updateCallback: EditorUpdateCallback | null = null;
    private isMultySelection = false;
    blocksMap: Map<string, Block> = new Map();
    initialBlocks: BlockData[] = [];

    constructor() {
        this.initialBlocks = initialBlocks.getState();
        this.blocks = initialBlocks
            .getState()
            .filter(block => block.parentId === null) // Только корневые
            .map((data) =>
                createBlockFromData(data, this, this.blocksMap, null, initialBlocks.getState())
            );
    }

    async forceUpdateBlocks() {
        this.initialBlocks = initialBlocks.getState();
        this.blocks = initialBlocks
            .getState()
            .filter(block => block.parentId === null) // Только корневые
            .map((data) =>
                createBlockFromData(data, this, this.blocksMap, null, initialBlocks.getState())
            );
        await this.forceRenderUpdate();
    }

    async setOnUpdate(callback: EditorUpdateCallback) {
        this.updateCallback = callback;
    }

    async forceRenderUpdate() {
      await this.updateCallback?.();
    }

    setActiveBlock(id: string | null) {
        this.activeBlockId = id;
    }
    handleKeyDown(containerEl: HTMLElement, event: FormEvent<HTMLDivElement>) {
        if (!this.activeBlockId) return;
        const block = this.blocksMap.get(this.activeBlockId);
        if (block) {
            block.onKeyDown(event);
        }
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
        const isBlock = (el: Element) => !!el.getAttribute('data-block-id')

        const range = selection.getRangeAt(0);
        const clonedSelection = range.cloneContents();
        const children = Array.from(clonedSelection.children);
        this.isMultySelection = !!children.length && children.every(isBlock);

        let node = range.startContainer;

        if (node.nodeType === Node.TEXT_NODE) {
            node = node.parentElement!;
        }

        const blockEl = (node as HTMLElement).closest("[data-block-id]") as HTMLElement | null;
        const id = blockEl?.dataset.blockId ?? null;
        this.setActiveBlock(id);
    }

    handleInput(containerEl: HTMLElement, event: FormEvent<HTMLDivElement>) {
        const id = this.activeBlockId;
        if (!id) return;

        const blockEl = containerEl.querySelector(`[data-block-id="${id}"]`) as HTMLElement;
        if (blockEl) {
            this.updateActiveBlockText(blockEl.innerHTML);
        }
    }

    handleBeforeInput(containerEl: HTMLElement, event: FormEvent<HTMLDivElement>) {
        if (this.isMultySelection) {
            event.preventDefault();
        }
    }
    toJSON(): BlockData[] {
        return this.blocks.map((block) => block.toData() as BlockData);
    }

    addBlock(block: BaseBlock) {
        this.blocks.push(block);
        this.forceRenderUpdate();
    }

    removeBlock(index: number) {
        this.blocks.splice(index, 1);
        this.forceRenderUpdate();
    }
}