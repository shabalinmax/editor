import type { BaseBlock } from "../../blocks/BaseBlock/model/BaseBlock.ts";
import { createBlockFromData } from "./createBlocksFromData.ts";
import type {Block, BlockData} from "../../blocks/types.ts";
import { nanoid } from "nanoid";
import React, {type FormEvent} from "react";

type EditorUpdateCallback = () => void;

export class EditorClass {
    blocks: Block[];
    activeBlockId: string | null = null;
    private updateCallback: EditorUpdateCallback | null = null;
    private isMultySelection = false;
    blocksMap: Map<string, Block> = new Map();
    constructor() {
        const initialData: BlockData[] = [
            { id: nanoid(), type: "heading", level: 1, text: "Welcome to the editor" },
            { id: nanoid(), type: "paragraph", text: "This is a paragraph" },
            {
                id: nanoid(),
                type: "heading",
                level: 1,
                text: "Nested List Example",
            },
            {
                id: nanoid(),
                type: "bullet-list",
                items: [
                    {
                        id: nanoid(),
                        type: "paragraph",
                        text: "First bullet item",
                    },
                    {
                        id: nanoid(),
                        type: "bullet-list",
                        items: [
                            {
                                id: nanoid(),
                                type: "paragraph",
                                text: "Nested bullet 1",
                            },
                            {
                                id: nanoid(),
                                type: "heading",
                                level: 3,
                                text: "Nested heading in list",
                            },
                        ],
                    },
                    {
                        id: nanoid(),
                        type: "paragraph",
                        text: "Second bullet item",
                    },
                ],
            },
            {
                id: nanoid(),
                type: "bullet-list",
                items: [
                    {
                        id: nanoid(),
                        type: "paragraph",
                        text: "First bullet point"
                    },
                    {
                        id: nanoid(),
                        type: "heading",
                        level: 2,
                        text: "Subheading in list"
                    },
                    {
                        id: nanoid(),
                        type: "bullet-list",
                        items: [
                            {
                                id: nanoid(),
                                type: "paragraph",
                                text: "Nested bullet point"
                            },
                            {
                                id: nanoid(),
                                type: "paragraph",
                                text: "Another nested bullet"
                            }
                        ]
                    }
                ]
            },
            {
                id: nanoid(),
                type: "checkbox-list",
                items: [
                    {
                        id: nanoid(),
                        type: "paragraph",
                        text: "Checkbox item 1"
                    },
                    {
                        id: nanoid(),
                        type: "numbered-list",
                        items: [
                            {
                                id: nanoid(),
                                type: "paragraph",
                                text: "Nested numbered inside checkbox"
                            }
                        ]
                    }
                ]
            }
        ];

        this.blocks = initialData.map((data) => createBlockFromData(data, this, this.blocksMap));

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
    handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (!this.activeBlockId) return;
        const block = this.blocksMap.get(this.activeBlockId);
        console.log('block', block, this.activeBlockId)
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
        console.log('sdad')
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
        this.forceUpdate();
    }

    removeBlock(index: number) {
        this.blocks.splice(index, 1);
        this.forceUpdate();
    }
}