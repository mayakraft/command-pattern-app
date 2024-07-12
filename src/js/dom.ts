
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
