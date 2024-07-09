import { execute } from "./shell.ts";
import { formatCommandResult } from "../js/format.ts";

interface Command {
	execute(): any;
	undo(): any;
  get asString(): string;
}

// Create a command class
export class JsBlobCommand implements Command {
	private jsBlob: string;

	constructor(jsBlob: string) {
		this.jsBlob = jsBlob;
	}

	get asString(): string {
		return this.jsBlob;
	}

	execute(): any {
		return execute(this.jsBlob);
	}

	undo(): any {
		// Implement undo logic. For now, we'll just log a message.
		console.log("Undoing:", this.jsBlob);
		// You can implement actual undo logic here.
	}
}

class CommandResult {
  private result: any;
  private stringified: string;

	get asString(): string {
    return this.stringified;
	}

	constructor(result: any) {
		this.result = result;
    this.stringified = formatCommandResult(result) || "";
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
		console.log("this.history", this.history);
    console.log("h", this.history.map(el => el.result));
		// return this.history.map(el => (el.command as any).asString).join('\n');
		return this.history
			.map(el => `${el.command.asString}\n${el.result.asString}`)
			.join('\n');
	}
}

export class CommandExecutor {
	private history: CommandHistory = new CommandHistory();

	executeCommand(command: Command): any {
		const res = command.execute();
    const result = new CommandResult(res);
		this.history.push({ command, result });
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
