<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Conformal + SvelteKit Example</title>
</svelte:head>

{@render children?.()}

<style>
  :global(body) {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 2rem;
    background: #f8f9fa;
  }
</style>
