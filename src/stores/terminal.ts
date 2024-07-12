import { get, writable, derived } from "svelte/store";
import { invoker } from "../kernel/invoker.ts";

/**
 * @description A record of the history, as a single string where each
 * line contains one history element, wrapped inside of an HTML span
 * element, with a class indicating if it was a result or not.
 */
export const TerminalHistoryHTMLString = derived(
	invoker.historyAsHTML,
	($entries) => $entries.join("\n"),
	"",
);

/**
 * @description a subroutine of the TerminalReprint store. get the
 * commandHistory and return the item at the index parameter,
 * or an empty string if length of 0.
 */
const getCommandFromHistory = (index: number): string => {
	const arr = get(invoker.commandHistory);
	if (!arr.length) { return ""; }
  let arrayIndex = index % arr.length;
  arrayIndex += arrayIndex < 0 ? arr.length : 0;
	return arr[arrayIndex];
};

/**
 * @description This captures the behavior of being at a terminal input and
 * using the up/down arrow keys to scroll through the history.
 * The value of this writable store is an integer, the index of the currently
 * selected command in the history. Call "increment" or "decrement" and a side-
 * effect will fire, one which will get() the invoker.commandHistory and
 * return the string of the currently selected command in the history.
 */
export const TerminalReprint = {
	...writable(0),
	increment: (): string => {
    let index = 0;
    TerminalReprint.update(n => { index = n + 1; return index; });
    return getCommandFromHistory(index);
	},
	decrement: (): string => {
    let index = 0;
    TerminalReprint.update(n => { index = n - 1; return index; });
    return getCommandFromHistory(index);
	},
};

// /**
//  * @description When a history is appended to the command history,
//  * in the case that the new history item is the exact same command
//  * as the most recent history item, then the terminal history is capable
//  * of collapsing the history so that the new method replaces the most
//  * recent history item; if the method is one of the methods in this list.
//  */
// const collapseMethods = {
// 	setGuideLinesCP: true,
// 	setGuideRaysCP: true,
// 	setGuideSegmentsCP: true,
// 	setGuideLinesFolded: true,
// 	setGuideRaysFolded: true,
// 	setGuideSegmentsFolded: true,
// 	setGhostGraphCP: true,
// 	setGhostGraphFolded: true,
// 	setTool: true,
// 	resetTool: true,
// 	highlight: true,
// 	pleatPreview: true,
// 	foldedLinePreview: true,
// };

// /**
//  *
//  */
// const filterCollapsible = (commands = []) =>
// 	commands.filter((name) => collapseMethods[name]);
