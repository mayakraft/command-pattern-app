import { readable, writable, derived, type Writable } from "svelte/store";
import { arrayIntersection } from "../js/arrays.ts";
import { TerminalTextareaValue } from "./dom.ts";
// import { invoker } from "./client.ts";
import { JsBlobCommand } from "./commands.ts";
import { execute } from "./shell.ts";
import { CommandExecutor } from "./commands.ts";

export const executor = new CommandExecutor();


// import {
// 	terminalOutputCommandResult,
// 	terminalOutputJavascript,
// 	terminalOutputError,
// } from "./format.js";

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

// /**
//  * @description The history of commands and their arguments. This will
//  * appear in the terminal output.
//  */
// export const CommandHistory = writable([]);

// /**
//  * @description Use this method to add new items to the command history.
//  * This method will ensure the array length is maintained, and this method
//  * will filter any collapsible methods.
//  */
// CommandHistory.add = (...args) =>
// 	CommandHistory.update((history) => {
// 		const previousEntry = history[history.length - 1] || {};
// 		const curr = filterCollapsible(args.flatMap((el) => el.commands || []));
// 		const prev = filterCollapsible(previousEntry.commands);
// 		if (arrayIntersection(curr, prev).length) {
// 			history.pop();
// 		}
// 		const result = [...history, ...args];
// 		if (result.length > maxLineCount) {
// 			result.splice(0, result.length - maxLineCount);
// 		}
// 		TerminalTextareaValue.set("");
// 		ReplayCommandIndex.set(0);
// 		return result;
// 	});

// /**
//  *
//  */
// export const ReplayCommandIndex = writable(0);
// ReplayCommandIndex.increment = () => ReplayCommandIndex.update((n) => n + 1);
// ReplayCommandIndex.decrement = () => ReplayCommandIndex.update((n) => n - 1);

// /**
//  *
//  */
// export const ReplayCommand = derived(
// 	[CommandHistory, ReplayCommandIndex],
// 	([$CommandHistory, $ReplayCommandIndex]) => {
// 		let absIndex = $ReplayCommandIndex;
// 		while (absIndex < 0) {
// 			absIndex += $CommandHistory.length;
// 		}
// 		while (absIndex >= $CommandHistory.length) {
// 			absIndex -= $CommandHistory.length;
// 		}
// 		return $CommandHistory[absIndex];
// 	},
// 	"",
// );

/**
 * @description A derived state of the CommandHistory, where each item
 * is converted into an HTML string inside of a span element.
 */
// export const TerminalHistory = derived(
// 	CommandHistory,
// 	($CommandHistory) =>
// 		$CommandHistory.length >= minLineCount
// 			? $CommandHistory
// 			: Array(minLineCount - $CommandHistory.length)
// 					.fill({ html: "<span></span>" })
// 					.concat($CommandHistory),
// 	[],
// );

// export const TerminalHistory = derived(
// 	invoker.commandHistory,
// 	($invokerCommandHistory) => ($invokerCommandHistory.length >= minLineCount
// 		? $invokerCommandHistory
// 		: Array(minLineCount - $invokerCommandHistory.length)
// 			.fill({ html: "<span></span>" })
// 			.concat($invokerCommandHistory)),
// 	[],
// );

// export const TerminalHistoryHTMLString = derived<Writable<Command[]>, string>(
// 	invoker.commandHistory,
//   ($commandHistory) => {
//     const commandsAsText = $commandHistory
//       ? $commandHistory.map(cmd => `<span>${cmd.print()}</span>`)
//       : [];
//     const entries = (commandsAsText.length >= minLineCount
// 	    ? commandsAsText
// 	    : Array(minLineCount - commandsAsText.length)
//         .fill("<span></span>")
//         .concat(commandsAsText));
//     return entries.join("<br />");
//     // return entries.join("\n");
//   },
// 	"",
// );

export const TerminalHistoryHTMLString = writable<string>("");

/**
 * @description run a javascript blob in an eval context which includes
 * all commands from the core of the app.
 * @param {string} jsBlob a javascript snippet
 * @returns {object[]} an array of objects meant for printing
 * as output into the terminal.
 */
export const terminalExecute = (jsBlob: string): void => {
	let result;
	const command = new JsBlobCommand(jsBlob);
	try {
		// files.forEach(f => { context[f.name] = f.contents; });
		// result = execute(jsBlob);
		executor.executeCommand(command);

    TerminalHistoryHTMLString.set(executor.getHistoryString());

	} catch (error) {
		console.error(error);
		// return [terminalOutputJavascript(jsBlob), terminalOutputError(error)];
	}
	// if the scoped eval returns undefined, the resulting html string
	// will be an empty string, if this is the case, don't include empty
	// strings in the terminal output.
	// return [
	// 	terminalOutputJavascript(jsBlob),
	// 	terminalOutputCommandResult(result),
	// ].filter((a) => a.html !== undefined);
};
