<script lang="ts">
	import { KeyboardDown, KeyboardUp } from "../stores/events.svelte.ts";

	const keydown = (e: KeyboardEvent) => KeyboardDown.value(e);
	const keyup = (e: KeyboardEvent) => KeyboardUp.value(e);
</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
/>
