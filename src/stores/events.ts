import { writable, derived } from "svelte/store";
import { TerminalTextarea, TerminalTextareaValue } from "./dom.ts";
import { invoker } from "../kernel/invoker.ts";
import { TerminalReprint } from "./terminal.ts";
import { isFormElementActive } from "../js/dom.ts";

/**
 * @description If a keyboard up event occured on a form element this method
 * will be called. Behavior can be tied to particular DOM form elements.
 */
const FormKeyboardUp = derived(
	[TerminalTextarea, TerminalTextareaValue],
	([$TerminalTextarea, $TerminalTextareaValue]) => (event: KeyboardEvent) => { },
	() => { },
);

/**
 * @description If a keyboard down event occured on a form element this method
 * will be called. Behavior can be tied to particular DOM form elements,
 * for example, the textarea that functions as the terminal input, to watch
 * for an ENTER key press to execute the command and clear the input.
 */
const FormKeyboardDown = derived(
	[TerminalTextarea, TerminalTextareaValue],
	([$TerminalTextarea, $TerminalTextareaValue]) => (event: KeyboardEvent) => {
		const { altKey, ctrlKey, metaKey, shiftKey } = event;
		// console.log("FormKeyboardEvent Down");
		if (document.activeElement === $TerminalTextarea) {
      // console.log(event.key);
			switch (event.key) {
				case "Enter":
        case "NumpadEnter":
          if (!event.shiftKey) {
            event.preventDefault();
            invoker.executeJavascript($TerminalTextareaValue);
            TerminalTextareaValue.set("");
            TerminalReprint.set(0);
          }
        break;
				case "z":
				case "Z":
					if (metaKey || ctrlKey) { invoker.undo(); }
				break;
				case "b":
        case "B":
          if (metaKey || ctrlKey) {
            invoker.executeMethod("background", `hsl(${Math.random() * 360}, 50%, 50%)`);
          }
        break;
				case "ArrowUp":
					TerminalTextareaValue.set(TerminalReprint.decrement());
					break;
				case "ArrowDown":
					TerminalTextareaValue.set(TerminalReprint.increment());
					break;
				default:
					break;
			}
		}
	},
	() => { },
);

/**
 * @description If a keyboard down event occured NOT on a form element,
 * it's considered an on-window event and this method will be called.
 */
const WindowKeyboardDown = writable((event: KeyboardEvent) => { });

/**
 * @description If a keyboard up event occured NOT on a form element,
 * it's considered an on-window event and this method will be called.
 */
const WindowKeyboardUp = writable((event: KeyboardEvent) => { });

/**
 * @description Main entry point for keyboard events, this will be bound to
 * the window.onkeydown event. This method will call one of two subroutines,
 * depending on if a form element is selected or not.
 */
export const KeyboardDown = derived(
	[FormKeyboardDown, WindowKeyboardDown],
	([$FormKeyboardDown, $WindowKeyboardDown]) => (event: KeyboardEvent) => (
		isFormElementActive()
			? $FormKeyboardDown(event)
			: $WindowKeyboardDown(event)),
	() => {},
);

/**
 * @description Main entry point for keyboard events, this will be bound to
 * the window.onkeyup event. This method will call one of two subroutines,
 * depending on if a form element is selected or not.
 */
export const KeyboardUp = derived(
	[FormKeyboardUp, WindowKeyboardUp],
	([$FormKeyboardUp, $WindowKeyboardUp]) => (event: KeyboardEvent) => (
		isFormElementActive()
			? $FormKeyboardUp(event)
			: $WindowKeyboardUp(event)),
	() => {},
);
