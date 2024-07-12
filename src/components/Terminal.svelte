<script lang="ts">
	import { TerminalHistoryHTMLString } from "../stores/terminal.ts";
	import {
		TerminalTextarea,
		TerminalTextareaValue,
	} from "../stores/dom.ts";

	let pre: Element;
	// todo: this is not firing
	$effect(() => { pre.scrollTop = pre.scrollHeight; });
</script>

<div class="container">
	<pre bind:this={pre}>{@html $TerminalHistoryHTMLString}</pre>
	<textarea
		bind:this={$TerminalTextarea}
		bind:value={$TerminalTextareaValue}
		autocomplete="off"
		autocorrect="off"
		rows="1"></textarea>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	pre, textarea {
		margin: 0;
		padding: 0 0.25rem;
	}
	pre {
		flex: 1 1 auto;
		overflow-x: hidden;
		overflow-y: scroll;
		font-family: monospace;
		background-color: #292929;
	}
	/* all text selection has been disabled in the app. */
	/* we have to explicitly re-enable it here */
	pre :global(*) {
		-webkit-user-select: initial;
		user-select: initial;
		cursor: auto;
	}
	pre :global(.result::before) {
		content: "> ";
		color: #888;
	}
	textarea {
		height: 1rem;
		flex: 0 0 auto;
		resize: none;
		border: 1px solid transparent;
		outline-color: transparent;
		background-color: #444;
	}
	textarea:focus {
		outline: none !important;
		border: 1px solid #863;
		outline-color: transparent;
		background-color: #444;
	}

	pre :global(.error) { color: var(--red); }
	pre :global(.return) { color: var(--dim); }
	pre :global(.prompt-symbol) { color: var(--dim); }
	pre :global(.IdentifierName) { color: var(--green); }
	pre :global(.Punctuator) { color: var(--text); }
	pre :global(.NumericLiteral) { color: var(--lightblue); }
	pre :global(.WhiteSpace) { color: var(--text); }
	pre :global(.StringLiteral) { color: var(--yellow); }
	/* these have not been seen yet, setting purple by default */
  pre :global(.NoSubstitutionTemplate) { color: var(--purple); }
  pre :global(.TemplateHead) { color: var(--purple); }
  pre :global(.TemplateMiddle) { color: var(--purple); }
  pre :global(.TemplateTail) { color: var(--purple); }
  pre :global(.RegularExpressionLiteral) { color: var(--purple); }
  pre :global(.MultiLineComment) { color: var(--purple); }
  pre :global(.SingleLineComment) { color: var(--purple); }
  pre :global(.PrivateIdentifier) { color: var(--purple); }
  pre :global(.LineTerminatorSequence) { color: var(--purple); }
  pre :global(.Invalid) { color: var(--purple); }
</style>
