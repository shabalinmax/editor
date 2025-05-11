export interface ListBlockData {
    id: string;
    type: "bullet-list" | "numbered-list" | "checkbox-list";
    parentId: string | null; // например, для вложенных списков
}

