import { scope } from "./scope.ts";

const shouldUseStrict = false;

// transfer all methods/constants from inside the "this."
// and into the top level of the scope.
const hoist = Object.keys(scope)
	.map((name) => `var ${name} = this.${name};`)
	.join("\n");

/**
 * @description run a Javascript blob in a context.
 * @param {string} jsBlob a snippet of Javascript code to be run
 * @param {object} scope the context to be bound to the function
 * @returns {any} whatever the Javascript code was meant to return
 * which, if the Javascript contains multiple lines of code, the return
 * object will be whatever the final line of code returns, or
 * "undefined" if nothing is returned.
 */
const scopedEval = (jsBlob: string, scope: object): any => {
	const line0 = shouldUseStrict ? '"use strict";' : ";";
	// const fileString = files
	// 	.map(f => `var ${f.name} = this.${f.name};`).join("");
	// hoist = hoist + fileString;
	try {
		return Function(`${line0} ${hoist}; return (${jsBlob})`).bind(scope)();
		// return Function(`${line0} ${hoist}; with (this) { return (${jsBlob}); }`).bind(scope)();
	} catch (e) {
		try {
			return Function(`${line0} ${hoist}; ${jsBlob}`).bind(scope)();
			// return Function(`${line0} ${hoist}; with (this) { ${jsBlob} }`).bind(scope)();
		} catch (error) {
      return error;
			// throw error;
			// console.error(error);
		}
	}
};

/**
 * @description This is the main point of entry to execute
 * a command in the context that contains all the app's functionality.
 * The command will pass through the app's Injections, be executed,
 * then print the output to the console.
 * @param {string} js a valid Javascript blob
 * @returns {any} whatever is the result of executing the javascript
 */
export const execute = (js: string): object[] => (
	scopedEval(js, scope)
);

// export const execute = (js: string) => {
// 	const commands = [js];
// 	get(Injections).forEach((modifier) => modifier.execute(commands));
// 	// add to the undo stack. clear the redo stack
// 	return commands.flatMap((command) => scopedEval(command, scope));
// };

const stringifyArgs = (...args: any[]): string => (
	`${args.map((v) => JSON.stringify(v)).join(", ")})`
);

/**
 * @description This is a more user-friendly alternative to "execute"
 * intended for only one method call, and it can include method arguments.
 * This allows the user to simply type the method name instead of
 * constructing a valid Javascript blob.
 */
export const executeCommand = (name: string, ...args: any[]) =>
	// execute(`${name}(${args.map((v) => JSON.stringify(v)).join(", ")})`);
	execute(`${name}(${stringifyArgs(...args)})`);
