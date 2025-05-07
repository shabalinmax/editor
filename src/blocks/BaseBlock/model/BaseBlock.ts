import type {HTMLText} from "./types.ts";
import {nanoid} from "nanoid";
import type {EditorClass} from "../../../editor/model/EditorClass.ts";

export abstract class BaseBlock {
    id: string;
    text: HTMLText;
    isFocus: boolean = false;
    editor?: EditorClass;

    constructor({id, text}: { id?: string, text: HTMLText }) {
        this.id = id ?? nanoid();
        this.text = text;
    }

    attachEditor(editor: EditorClass) {
        this.editor = editor;
    }

    updateText(newText: HTMLText) {
        this.text = newText;
    }

    abstract onKeyDown(event: KeyboardEvent): void;

    abstract onFocus(): void;
}