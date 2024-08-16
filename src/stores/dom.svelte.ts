/**
 * @note We can't bind an event directly to the state of the string,
 * instead we have to watch for the keyboard events directly. For example,
 * we want to fire the event after a "Return" key, but not after a
 * "Shift + Return" combo, if we simply look at the last character, code 13
 * for newline, there is information if it was created with a Shift or not.
 */
export const TerminalTextarea: {
	element?: HTMLTextAreaElement;
	value?: string;
} = $state({
	//  DOM element reference for the textarea, the "input" to the terminal.
	element: undefined,
	// The current value of the terminal input.
	value: undefined,
});
