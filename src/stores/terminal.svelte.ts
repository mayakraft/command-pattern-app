import { invoker } from "../kernel/invoker.svelte.ts";

/**
 * @description A record of the history, as a single string where each
 * line contains one history element, wrapped inside of an HTML span
 * element, with a class indicating if it was a result or not.
 */
export const TerminalHistoryHTMLString = (() => {
	const value = $derived(invoker.historyAsHTML.join("\n"));
	return {
		get value() {
			return value;
		},
	};
})();

/**
 * @description a subroutine of the TerminalReprint store. get the
 * commandHistory and return the item at the index parameter,
 * or an empty string if length of 0.
 */
const getCommandFromHistory = (index: number): string => {
	if (!invoker.commandHistory.length) {
		return "";
	}
	let arrayIndex = index % invoker.commandHistory.length;
	arrayIndex += arrayIndex < 0 ? invoker.commandHistory.length : 0;
	return invoker.commandHistory[arrayIndex];
};

/**
 * @description This captures the behavior of being at a terminal input and
 * using the up/down arrow keys to scroll through the history.
 * The value of this writable store is an integer, the index of the currently
 * selected command in the history. Call "increment" or "decrement" and a side-
 * effect will fire, one which will get() the invoker.commandHistory and
 * return the string of the currently selected command in the history.
 */
export const TerminalReprint = (() => {
	let value = $state(0);
	return {
		get value() {
			return value;
		},
		set value(newValue) {
			value = newValue;
		},
		increment: (): string => {
			value += 1;
			return getCommandFromHistory(value);
		},
		decrement: (): string => {
			value -= 1;
			return getCommandFromHistory(value);
		},
	};
})();

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
