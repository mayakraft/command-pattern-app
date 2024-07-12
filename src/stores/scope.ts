// import ear from "rabbit-ear";
// import { Invoker } from "./invoker.ts";
// import { Mesh, UIManager } from "./receivers.ts";
// import { MeshProxy, UIManagerProxy } from "./commandProxys.ts";
import { ChangeBackgroundColorCommand } from "./commands.ts";
import { invoker } from "./invoker.ts";

// export const invoker = new Invoker();
// const mesh = new Mesh();
// const uiManager = new UIManager();

// // the context which will bind to the Function's this.
// // const context = Object.assign({ ...ear }, Commands);
// export const scope = {
// 	mesh: new MeshProxy(mesh, invoker),
// 	uiManager: new UIManagerProxy(uiManager, invoker),
// 	invoker,
// };

export const scope = {
	background: (color: string) => invoker
		.execute(new ChangeBackgroundColorCommand(color)),
};
