import { type Command } from "./command.ts";
import { execute } from "../kernel/shell.svelte.ts";
import { formatJavascript } from "../js/format.ts";

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
    return execute(this.js);
  }

  undo(): any {
    console.log("todo: undo", this.js);
  }
}
