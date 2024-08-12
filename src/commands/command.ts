/**
 *
 */
export interface Tokenizable {
	get asString(): string;
	get asTokenString(): string; // with html tags
}

/**
 *
 */
export interface Command extends Tokenizable {
	// static name: string; // also need this
	execute(): any;
	undo(): any;
}

// export abstract class Command implements Tokenizable {
// 	static name: string;
// 	abstract execute(): any;
// 	abstract undo(): any;
// 	abstract get asString(): string;
//   abstract get asTokenString(): string; // with html tags
// }
