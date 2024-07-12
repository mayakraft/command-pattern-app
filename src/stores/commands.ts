import { execute } from "./shell.ts";
import { formatJavascript } from "../js/format.ts";
import { type Command, type Tokenizable } from "./command.ts";

// Create a command class
export class JavascriptCommand implements Command {
	private js: string;

	constructor(js: string) {
		this.js = js;
	}

	get asString(): string {
		return this.js;
	}

	get asTokenString(): string {
		return formatJavascript(this.asString);
	}

	execute(): any {
		console.log(`JavascriptCommand execute(${this.asString})`);
		return execute(this.js);
	}

	undo(): any {
		console.log("Undoing:", this.js);
	}
}

export class ChangeBackgroundColorCommand implements Command {
	private color: string;
	private previousColor: string | null;

	constructor(color: string) {
		this.color = color;
		this.previousColor = document.body.style.backgroundColor
			|| getComputedStyle(document.body)["background-color"];
	}

	get asString(): string {
		return `background(${JSON.stringify(this.color)})`;
	}

	get asTokenString(): string {
		// return `<span style="color:${this.color}">Change background to ${this.color}</span>`;
		return formatJavascript(this.asString);
	}

	execute(): any {
		this.previousColor = document.body.style.backgroundColor
			|| getComputedStyle(document.body)["background-color"];
		document.body.style.backgroundColor = this.color;
	}

	undo(): any {
		if (this.previousColor) {
			document.body.style.backgroundColor = this.previousColor;
		} else {

		}
	}
}
