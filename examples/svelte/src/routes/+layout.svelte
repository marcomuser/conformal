<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Conformal + SvelteKit Example</title>
</svelte:head>

<main>
  {@render children?.()}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    min-height: 100vh;
  }

  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
