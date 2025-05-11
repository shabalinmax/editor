import {nanoid} from "nanoid";
import type {EditorClass} from "../../../editor/model/EditorClass.ts";
import type { JSX } from "react";

export abstract class BaseBlock {
    id: string;
    isFocus: boolean = false;
    editor?: EditorClass;

    constructor({id}: { id?: string }) {
        this.id = id ?? nanoid();
    }

    attachEditor(editor: EditorClass) {
        this.editor = editor;
    }

    getTag(): keyof JSX.IntrinsicElements | null {
        return null
    };

    spitterBlock() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const ref = document.getElementById(this.id);
        if (!ref || !this.editor) return;

        // Получаем левую часть: от начала элемента до начала выделения
        const rangeLeft = document.createRange();
        rangeLeft.selectNodeContents(ref);
        rangeLeft.setEnd(range.startContainer, range.startOffset);

        const fragmentLeft = rangeLeft.cloneContents();
        const divLeft = document.createElement("div");
        divLeft.appendChild(fragmentLeft);
        const leftContent = divLeft.innerHTML;

        // Получаем правую часть: от конца выделения до конца элемента
        const rangeRight = document.createRange();
        rangeRight.selectNodeContents(ref);
        rangeRight.setStart(range.endContainer, range.endOffset);

        const fragmentRight = rangeRight.cloneContents();
        const divRight = document.createElement("div");
        divRight.appendChild(fragmentRight);
        const rightContent = divRight.innerHTML;
        return {
            leftContent,
            rightContent
        }
    }


    abstract onKeyDown(event: KeyboardEvent): void;

    abstract onFocus(): void;
}