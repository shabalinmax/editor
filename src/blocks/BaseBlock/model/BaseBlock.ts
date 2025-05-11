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


    abstract onKeyDown(event: KeyboardEvent): void;

    abstract onFocus(): void;
}