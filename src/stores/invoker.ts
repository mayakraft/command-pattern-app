import { type Command, type Tokenizable } from "./command.ts";
import { JavascriptCommand } from "./commands.ts";
import { formatCommandResult } from "../js/format.ts";
import { matchFromArray } from "../js/arrays.ts";
import { scope } from "./scope.ts";

class CommandResult implements Tokenizable {
	private result: any;
	private isError: boolean;
	private stringified: string;

	get asString(): string {
		return this.stringified;
	}

	get asTokenString(): string {
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

type CommandAndResult = {
	command: Command,
	result: CommandResult,
};

class CommandHistory {
	private history: CommandAndResult[] = [];
	private commandStrings: string[] = [];

	push({ command, result }: CommandAndResult): void {
		this.history.push({ command, result });
	}

	pop(): CommandAndResult | undefined {
		return this.history.pop();
	}

	clear(): void {
		this.history = [];
	}

	getHistoryString(): string {
		// console.log(this.history.map(el => el.command.asTokenString));
		return this.history
			.map(el => `<span>${el.command.asTokenString}</span>\n<span class="result">${el.result.asTokenString}</span>`)
			.join('\n');
	}
}

class Invoker {
	private history: CommandHistory = new CommandHistory();

	execute(command: Command): any {
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

	getHistoryString(): string {
		return this.history.getHistoryString();
	}
}

export const invoker = new Invoker();
