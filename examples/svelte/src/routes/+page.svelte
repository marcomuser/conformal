<script lang="ts">
  import { enhance } from "$app/forms";

  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  const submission = $derived(form || data.submission);
</script>

<div class="app">
  <h1>Conformal + SvelteKit Example</h1>
  <p>Type-safe form submissions with native FormData</p>

  <form method="POST" use:enhance class="form">
    <div class="field">
      <label for="name">Name</label>
      <input
        id="name"
        name="name"
        value={submission.input?.name}
        placeholder="Enter your name"
      />
      {#if submission.fieldErrors?.name}
        <span class="error">{submission.fieldErrors.name.at(0)}</span>
      {/if}
    </div>

    <div class="field">
      <label for="age">Age</label>
      <input
        id="age"
        name="age"
        type="number"
        value={submission.input?.age}
        placeholder="Enter your age"
      />
      {#if submission.fieldErrors?.age}
        <span class="error">{submission.fieldErrors.age.at(0)}</span>
      {/if}
    </div>

    <div class="field">
      <label class="checkbox-label">
        <input
          name="acceptTerms"
          type="checkbox"
          checked={submission.input?.acceptTerms === "on"}
        />
        I accept the terms and conditions
      </label>
      {#if submission.fieldErrors?.acceptTerms}
        <span class="error">
          {submission.fieldErrors.acceptTerms.at(0)}
        </span>
      {/if}
    </div>

    {#if submission.formErrors && submission.formErrors.length > 0}
      <div class="form-errors">
        {#each submission.formErrors as error, index (index)}
          <span class="error">{error}</span>
        {/each}
      </div>
    {/if}

    <button type="submit">
      {submission.status === "success" ? "Submitted!" : "Submit"}
    </button>
  </form>

  {#if submission.status === "success"}
    <div class="success-message">
      <h3>Form submitted successfully!</h3>
      <p>Data saved: {JSON.stringify(submission.value, null, 2)}</p>
    </div>
  {/if}
</div>

<style>
  .app {
    max-width: 500px;
    margin: 0 auto;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  p {
    margin: 0 0 2rem 0;
    color: #666;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #333;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #007bff;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: 500;
    color: #333;
  }

  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }

  .error {
    color: #dc3545;
    font-size: 0.875rem;
  }

  .form-errors {
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 0.75rem;
  }

  .success-message {
    background: #d4edda;
    border: 1px solid #c3e6cb;
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .success-message h3 {
    margin: 0 0 0.5rem 0;
    color: #155724;
  }

  .success-message p {
    margin: 0;
    font-family: monospace;
    background: #f8f9fa;
    padding: 0.5rem;
    border-radius: 3px;
    font-size: 0.875rem;
  }
</style>
