import type {ParagraphBlockData} from "./ParagraphBlock/model/types.ts";
import type {HeadingBlockData} from "./HeadingBlock/model/types.ts";
import type {ListBlockData} from "./ListBlock/model/types.ts";
import {NumberedListBlock} from "./ListBlock/model/NumberedListBlock.ts";
import {CheckboxListBlock} from "./ListBlock/model/CheckboxListBlock.ts";
import {ParagraphBlock} from "./ParagraphBlock/model/ParagraphBlock.ts";
import {HeadingBlock} from "./HeadingBlock/model/HeadingBlock.ts";
import {BulletListBlock} from "./ListBlock/model/BulletListBlock.ts";

export type BlockData = ParagraphBlockData | HeadingBlockData | ListBlockData

export type Block = ParagraphBlock | HeadingBlock | BulletListBlock | NumberedListBlock | CheckboxListBlock