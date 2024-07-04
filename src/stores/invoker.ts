import { Command } from "./commands.ts";

export class Invoker {
	private commandHistory: Command[] = [];
	private undoHistory: Command[] = [];

	executeCommand(command: Command) {
		command.execute();
		this.commandHistory.push(command);
		this.undoHistory = []; // Clear redo history on new command
	}

	undo() {
		if (this.commandHistory.length > 0) {
			const command = this.commandHistory.pop();
      if (!command) { return; }
			command.undo();
			this.undoHistory.push(command);
		}
	}

	redo() {
		if (this.undoHistory.length > 0) {
			const command = this.undoHistory.pop();
			if (!command) { return; }
			command.execute();
			this.commandHistory.push(command);
		}
	}
}

// export class Invoker {
//   commandHistory: Command[];
//   undoHistory: Command[];
//   command?: Command;

// 	constructor() {
// 		this.commandHistory = [];
// 		this.undoHistory = [];
//     this.command = undefined;
// 	}

// 	// separate setter and execute
// 	setCommand(command: Command) {
// 		this.command = command;
// 	}

// 	pressButton() {
//     if (!this.command) { return; }
// 		this.command.execute();
// 		this.commandHistory.push(this.command);
// 		// todo: should this be before the early return?
// 		this.undoHistory = []; // Clear redo history on new command
// 	}

// 	// combined set and execute
// 	// executeCommand(command) {
// 	// 	command.execute();
// 	// 	this.commandHistory.push(command);
// 	// 	this.undoHistory = []; // Clear redo history on new command
// 	// }

// 	undo() {
// 		if (this.commandHistory.length > 0) {
// 			const command = this.commandHistory.pop();
//       if (!command) { return; }
// 			command.undo();
// 			this.undoHistory.push(command);
// 		}
// 	}

// 	redo() {
// 		if (this.undoHistory.length > 0) {
// 			const command = this.undoHistory.pop();
//       if (!command) { return; }
// 			command.execute();
// 			this.commandHistory.push(command);
// 		}
// 	}
// }
