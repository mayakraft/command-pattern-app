export interface Tokenizable {
	get asString(): string;
	get asTokenString(): string; // with html tags
}

export interface Command {
	execute(): any;
	undo(): any;
	get asString(): string;
	get asTokenString(): string; // with html tags
}
