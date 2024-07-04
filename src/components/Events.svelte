<script lang="ts">
	import { KeyboardDown, KeyboardUp } from "../stores/events.ts";

	const keydown = (e: KeyboardEvent) => $KeyboardDown(e);
	const keyup = (e: KeyboardEvent) => $KeyboardUp(e);
</script>

<svelte:window
	on:keydown={keydown}
	on:keyup={keyup}
/>
