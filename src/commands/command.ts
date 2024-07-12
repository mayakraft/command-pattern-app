export interface Tokenizable {
	get asString(): string;
	get asTokenString(): string; // with html tags
}

export interface Command extends Tokenizable {
	execute(): any;
	undo(): any;
}
