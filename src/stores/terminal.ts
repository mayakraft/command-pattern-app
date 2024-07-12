import { get, writable, derived } from "svelte/store";
import { invoker } from "../kernel/invoker.ts";

/**
 * @description On boot or after the history is cleared,
 * terminal will pad the history with empty new lines
 * until it reaches at least this many. The reason for this
 * is because the text container is top-justified, and when
 * only one command is added we want the command to be at the bottom.
 * Technically, this operates on TerminalHistory, not CommandHistory.
 */
const minLineCount = 24;

/**
 * @description Terminal will only save the most recent N number of commands
 * in its history.
 * Technically, this operates on CommandHistory, not TerminalHistory.
 */
const maxLineCount = 300;

/**
 * @description A record of the history, as a single string where each
 * line contains one history element, wrapped inside of an HTML span
 * element, with a class indicating if it was a result or not.
 */
export const TerminalHistoryHTMLString = derived(
	invoker.historyAsHTML,
	($entries) => Array(Math.max(0, minLineCount - $entries.length))
    .fill("<span></span>")
    .concat($entries)
    .join("\n"),
	"",
);

const getCommandFromHistory = (index: number): string => {
	const arr = get(invoker.commandHistory);
	if (!arr.length) { return ""; }
  let arrayIndex = index % arr.length;
  arrayIndex += arrayIndex < 0 ? arr.length : 0;
	return arr[arrayIndex];
};

export const TerminalReprint = {
	...writable(0),
	increment: () => {
    let index = 0;
    TerminalReprint.update(n => { index = n + 1; return index; });
    return getCommandFromHistory(index);
	},
	decrement: () => {
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
