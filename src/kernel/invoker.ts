import { derived } from "svelte/store";
import { type WritableArray, createArrayStore } from "../stores/general.ts";
import { type Command, type Tokenizable } from "../commands/command.ts";
import { JavascriptCommand } from "../commands/commands.ts";
import { formatCommandResult } from "../js/format.ts";
import { matchFromArray } from "../js/arrays.ts";
import { scope } from "./scope.ts";

const stringifyArgs = (...args: any[]): string => (
	`${args.map((v) => JSON.stringify(v)).join(", ")}`
);

class CommandResult implements Tokenizable {
	private result: any;
	private isError: boolean;
	private stringified: string;

	get asString(): string {
		return this.stringified;
	}

	get asTokenString(): string {
		// if (this.isError) { console.error(this.result); }
		return this.isError
			? `<span class="error">${this.stringified}</span>`
			: `<span>${this.stringified}</span>`;
	}

	constructor(result: any) {
		this.isError = result instanceof Error;
		this.result = result;
		this.stringified = this.isError
			? `${result}`
			: formatCommandResult(result) || "";
	}
}

export type CommandAndResult = {
	command: Command,
	result: CommandResult,
};

class Invoker {
  public history: WritableArray<CommandAndResult> = createArrayStore<CommandAndResult>();

  /**
	 * @description An array of the history of the command inputs.
	 * This contains the inputs only, no results. There is no HTML span wrapper.
	 */
	public historyAsHTML = derived<WritableArray<CommandAndResult>, string[]>(
		this.history,
		($invokerCommandHistory) => $invokerCommandHistory
      .flatMap(({ command, result }) => [
        `<span>${command.asTokenString}</span>`,
        `<span class="result">${result.asTokenString}</span>`,
      ]),
		[],
	);

	/**
	 * @description An array of the history of the command inputs.
	 * This contains the inputs only, no results. There is no HTML span wrapper.
	 */
	public commandHistory = derived<WritableArray<CommandAndResult>, string[]>(
		this.history,
		($invokerCommandHistory) => $invokerCommandHistory
			.map(({ command }) => command.asString),
		[],
	);

	executeCommand(command: Command): any {
		const res = command.execute();
		const result = new CommandResult(res);
		if (command instanceof JavascriptCommand
			&& matchFromArray(command.asString, Object.keys(scope)).length) {
			// console.log(`! 3b invoker: skipping javascript command ${command.asString}`);
		} else {
			this.history.push({ command, result });
		}
		return result;
	}

	executeJavascript(js: string): any {
    return this.executeCommand(new JavascriptCommand(js));
  }

  /**
   * @description This is a more user-friendly alternative to "executeJavascript"
   * intended for only one method call, and it can include method arguments.
   * This allows the user to simply type the method name instead of
   * constructing a valid Javascript blob.
   * @example executeMethod("add", 3, 4) will call the method add(3, 4);
   */
  executeMethod(name: string, ...args: any[]) {
    console.log(`${name}(${stringifyArgs(...args)})`);
    return this.executeJavascript(`${name}(${stringifyArgs(...args)})`);
  }

	undo(): any {
		const latest = this.history.pop();
		if (!latest) {
			console.log("no command to undo");
			return;
		}
		const { command, result } = latest;
		if (command) {
			return command.undo();
		} else {
			console.log("No commands to undo.");
		}
	}
}

export const invoker = new Invoker();
