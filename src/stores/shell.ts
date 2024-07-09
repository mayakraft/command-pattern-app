// import { scope } from "./client.ts";

const scope = {};

const shouldUseStrict = true;

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
	} catch (e) {
		try {
			return Function(`${line0} ${hoist}; ${jsBlob}`).bind(scope)();
		} catch (error) {
			// throw error;
			console.error(error);
		}
	}
};

export const execute = (jsBlob: string): object[] => (
	scopedEval(jsBlob, scope)
);
