import { writable } from "svelte/store";

/**
 * @description DOM element references.
 */
export const TerminalTextarea = writable<HTMLTextAreaElement>(undefined);
export const TerminalTextareaValue = writable<string>(undefined);
