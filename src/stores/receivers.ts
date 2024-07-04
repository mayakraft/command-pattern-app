// Receiver
export class Mesh {
	simplify() {
		console.log("Simplifying the mesh");
	}

	addFace() {
		console.log("Adding a face to the mesh");
	}

	removeFace() {
		console.log("Removing a face from the mesh");
	}

	splitFace() {
		console.log("Splitting a face in the mesh");
	}

	triangulate() {
		console.log("Triangulating the mesh");
	}
}

export class UIManager {
	selectTool(tool: string) {
		console.log(`Selected tool: ${tool}`);
	}

	addToSelection(item: string) {
		console.log(`Added ${item} to selection`);
	}

	removeFromSelection(item: string) {
		console.log(`Removed ${item} from selection`);
	}
}
