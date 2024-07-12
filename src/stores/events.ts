import { writable, derived } from "svelte/store";
import { TerminalTextarea, TerminalTextareaValue } from "./dom.ts";
import { invoker } from "../kernel/invoker.ts";
import { TerminalReprint } from "./terminal.ts";

/**
 * @description Query the document.activeElement and depending on
 * which element is active, return true if that element is a form
 * element which typically accepts text input. This includes input
 * type=text, does not include type=radio.
 */
export const isFormElementActive = () => {
	const node = document.activeElement;
	if (!node) {
		return false;
	}
	const name = (node.nodeName || "").toLowerCase();
	const type = (node.type || "").toLowerCase();
	// if these node types are currently active,
	// touches will not be intercepted.
	switch (name) {
		case "textarea":
			return true;
		case "input":
			switch (type) {
				case "date":
				case "datetime-local":
				case "month":
				case "number":
				case "password":
				case "tel":
				case "time":
				case "email":
				case "text":
					return true;
				case "button":
				case "checkbox":
				case "color":
				case "file":
				case "hidden":
				case "image":
				case "radio":
				case "range":
				case "reset":
				case "search":
				case "submit":
				case "url":
				case "week":
				default:
					return false;
			}
		default:
			return false;
	}
	// an alternative approach would be to store a reference
	// to every known form element (which requires generating
	// this list), and the compare directly to these references, like:
	// if (document.activeElement === get(TerminalTextarea))
};

const FormKeyboardUp = derived(
	[TerminalTextarea, TerminalTextareaValue],
	([$TerminalTextarea, $TerminalTextareaValue]) => (event: KeyboardEvent) => {
		// console.log("FormKeyboardEvent Up");
	},
	() => { },
);

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
            console.log("invoker.executeMethod");
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
 *
 */
// const WindowKeyboardEvent = derived(
// 	[AppKeyboardEvent, ToolKeyboardEvent],
// 	([$AppKeyboardEvent, $ToolKeyboardEvent]) => (event: KeyboardEvent) => {
// 	// 	if ($AppKeyboardEvent(eventType, event)) {
// 	// 		return;
// 	// 	}
// 	// 	if ($ToolKeyboardEvent(eventType, event)) {
// 	// 		return;
// 	// 	}
// 	},
// 	() => {},
// );
const WindowKeyboardEvent = writable((event: KeyboardEvent) => { });

/**
 * 0.61812
 */
// export const KeyboardEvent = derived(
// 	[FormKeyboardEvent, WindowKeyboardEvent],
// 	([$FormKeyboardEvent, $WindowKeyboardEvent]) =>
// 		(eventType, event) => {
// 			switch (eventType) {
// 				case "down":
// 					Keyboard.update((keys) => ({ ...keys, [event.keyCode]: true }));
// 					break;
// 				case "up":
// 					Keyboard.update((keys) => {
// 						delete keys[event.keyCode];
// 						// return { ...keys };
// 						return keys;
// 					});
// 					break;
// 			}
// 			return isFormElementActive()
// 				? $FormKeyboardEvent(eventType, event)
// 				: $WindowKeyboardEvent(eventType, event);
// 		},
// 	() => {},
// );

export const KeyboardDown = derived(
	[FormKeyboardDown, WindowKeyboardEvent],
	([$FormKeyboardDown, $WindowKeyboardEvent]) => (event: KeyboardEvent) => {
		// Keyboard.update((keys) => ({ ...keys, [event.keyCode]: true }));
    // console.log("isFormElementActive", isFormElementActive());
		return isFormElementActive()
			? $FormKeyboardDown(event)
			: $WindowKeyboardEvent(event);
	},
	() => {},
);

export const KeyboardUp = derived(
	[FormKeyboardUp, WindowKeyboardEvent],
	([$FormKeyboardUp, $WindowKeyboardEvent]) => (event: KeyboardEvent) => {
		// Keyboard.update((keys) => {
		// 	delete keys[event.keyCode];
		// 	// return { ...keys };
		// 	return keys;
		// });
		return isFormElementActive()
			? $FormKeyboardUp(event)
			: $WindowKeyboardEvent(event);
	},
	() => {},
);
