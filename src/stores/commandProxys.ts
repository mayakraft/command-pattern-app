import { Mesh, UIManager } from "./receivers.ts";
import { Invoker } from "./invoker.ts";
import {
  SimplifyMeshCommand,
  AddFaceCommand,
  RemoveFaceCommand,
  SplitFaceCommand,
  TriangulateMeshCommand,
  SelectToolCommand,
  AddToSelectionCommand,
  RemoveFromSelectionCommand,
} from "./commands.ts";

export class MeshProxy {
    private mesh: Mesh;
    private invoker: Invoker;

    constructor(mesh: Mesh, invoker: Invoker) {
        this.mesh = mesh;
        this.invoker = invoker;
    }

    simplify() {
        const command = new SimplifyMeshCommand(this.mesh);
        this.invoker.executeCommand(command);
    }

    addFace() {
        const command = new AddFaceCommand(this.mesh);
        this.invoker.executeCommand(command);
    }

    removeFace() {
        const command = new RemoveFaceCommand(this.mesh);
        this.invoker.executeCommand(command);
    }

    splitFace() {
        const command = new SplitFaceCommand(this.mesh);
        this.invoker.executeCommand(command);
    }

    triangulate() {
        const command = new TriangulateMeshCommand(this.mesh);
        this.invoker.executeCommand(command);
    }
}

export class UIManagerProxy {
    private uiManager: UIManager;
    private invoker: Invoker;

    constructor(uiManager: UIManager, invoker: Invoker) {
        this.uiManager = uiManager;
        this.invoker = invoker;
    }

    selectTool(tool: string) {
        const command = new SelectToolCommand(this.uiManager, tool);
        this.invoker.executeCommand(command);
    }

    addToSelection(item: string) {
        const command = new AddToSelectionCommand(this.uiManager, item);
        this.invoker.executeCommand(command);
    }

    removeFromSelection(item: string) {
        const command = new RemoveFromSelectionCommand(this.uiManager, item);
        this.invoker.executeCommand(command);
    }
}
