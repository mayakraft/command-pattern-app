import { Mesh, UIManager } from "./receivers.ts";

// Command Interface (abstract base classs)
export class Command {
	execute() {}
	undo() {}
}

export class SimplifyMeshCommand implements Command {
    private mesh: Mesh;

    constructor(mesh: Mesh) {
        this.mesh = mesh;
    }

    execute() {
        this.mesh.simplify();
    }

    undo() {
        console.log("Undo simplify mesh");
    }
}

export class AddFaceCommand implements Command {
    private mesh: Mesh;

    constructor(mesh: Mesh) {
        this.mesh = mesh;
    }

    execute() {
        this.mesh.addFace();
    }

    undo() {
        this.mesh.removeFace();
    }
}

export class RemoveFaceCommand implements Command {
    private mesh: Mesh;

    constructor(mesh: Mesh) {
        this.mesh = mesh;
    }

    execute() {
        this.mesh.removeFace();
    }

    undo() {
        this.mesh.addFace();
    }
}

export class SplitFaceCommand implements Command {
    private mesh: Mesh;

    constructor(mesh: Mesh) {
        this.mesh = mesh;
    }

    execute() {
        this.mesh.splitFace();
    }

    undo() {
        console.log("Undo split face");
    }
}

export class TriangulateMeshCommand implements Command {
    private mesh: Mesh;

    constructor(mesh: Mesh) {
        this.mesh = mesh;
    }

    execute() {
        this.mesh.triangulate();
    }

    undo() {
        console.log("Undo triangulate mesh");
    }
}


export class SelectToolCommand implements Command {
    private uiManager: UIManager;
    private tool: string;

    constructor(uiManager: UIManager, tool: string) {
        this.uiManager = uiManager;
        this.tool = tool;
    }

    execute() {
        this.uiManager.selectTool(this.tool);
    }

    undo() {
        console.log(`Undo select tool: ${this.tool}`);
    }
}

export class AddToSelectionCommand implements Command {
	private uiManager: UIManager;
	private item: string;

	constructor(uiManager: UIManager, item: string) {
		this.uiManager = uiManager;
		this.item = item;
	}

	execute() {
		this.uiManager.addToSelection(this.item);
	}

	undo() {
		this.uiManager.removeFromSelection(this.item);
	}
}

export class RemoveFromSelectionCommand implements Command {
	private uiManager: UIManager;
	private item: string;

	constructor(uiManager: UIManager, item: string) {
		this.uiManager = uiManager;
		this.item = item;
	}

	execute() {
		this.uiManager.removeFromSelection(this.item);
	}

	undo() {
		this.uiManager.addToSelection(this.item);
	}
}
