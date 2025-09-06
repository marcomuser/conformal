import { useActionState } from "react";
import { parseWithSchema, serialize, type Submission } from "conformal";
import * as z from "zod";
import * as zf from "conformal/zod";
import "./Form.css";

type SchemaValues = z.infer<typeof schema>;
const schema = z.object({
  name: zf.string(),
  age: zf.number(),
  acceptTerms: zf.boolean(),
});

async function submitAction(
  lastSubmission: Submission<SchemaValues>,
  formData: FormData,
): Promise<Submission<SchemaValues>> {
  const submission = parseWithSchema(schema, formData).submission();

  if (submission.status !== "success") {
    return submission;
  }

  // Simulate saving to database
  console.log("Saving to database:", submission.value);

  // Reset form on successful submission
  return { ...submission, input: {} };
}

export function Form({
  defaultValues,
}: {
  defaultValues: Partial<SchemaValues>;
}) {
  const [submission, formAction] = useActionState(submitAction, {
    status: "idle",
    input: serialize(defaultValues),
    fieldErrors: {},
    formErrors: [],
  });

  return (
    <div className="app">
      <h1>Conformal + React 19 Example</h1>
      <p>Type-safe form submissions with native FormData</p>

      <form action={formAction} className="form">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            defaultValue={submission.input.name}
            placeholder="Enter your name"
          />
          {submission.fieldErrors.name && (
            <span className="error">{submission.fieldErrors.name.at(0)}</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            defaultValue={submission.input.age}
            placeholder="Enter your age"
          />
          {submission.fieldErrors.age && (
            <span className="error">{submission.fieldErrors.age.at(0)}</span>
          )}
        </div>

        <div className="field">
          <label className="checkbox-label">
            <input
              name="acceptTerms"
              type="checkbox"
              defaultChecked={submission.input.acceptTerms === "on"}
            />
            I accept the terms and conditions
          </label>
          {submission.fieldErrors.acceptTerms && (
            <span className="error">
              {submission.fieldErrors.acceptTerms.at(0)}
            </span>
          )}
        </div>

        {submission.formErrors.length > 0 && (
          <div className="form-errors">
            {submission.formErrors.map((error, index) => (
              <span key={index} className="error">
                {error}
              </span>
            ))}
          </div>
        )}

        <button type="submit">
          {submission.status === "success" ? "Submitted!" : "Submit"}
        </button>
      </form>

      {submission.status === "success" && (
        <div className="success-message">
          <h3>Form submitted successfully!</h3>
          <p>Data saved: {JSON.stringify(submission.value, null, 2)}</p>
        </div>
      )}
    </div>
  );
}
