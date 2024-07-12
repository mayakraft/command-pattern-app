// import ear from "rabbit-ear";
import { ChangeBackgroundColorCommand } from "../commands/background.ts";
import { invoker } from "./invoker.ts";

// all command should be bound to this scope object.

// the context which will bind to the Function's this.
// const context = Object.assign({ ...ear }, Commands);
export const scope = {
	// invoker,
	background: (color: string) => invoker
		.executeCommand(new ChangeBackgroundColorCommand(color)),
};
