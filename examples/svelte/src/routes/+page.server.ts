import { parseFormData, type Submission } from "conformal";
import * as z from "zod";
import * as zf from "conformal/zod";
import type { Actions, PageServerLoad } from "./$types";

const schema = zf.object({
  name: zf.string(),
  age: zf.number(),
  acceptTerms: zf.boolean(),
});

type FormSubmission = Submission<z.infer<typeof schema>>;

export const load: PageServerLoad = async () => {
  const initialSubmission: FormSubmission = {
    status: "idle",
    input: {},
    fieldErrors: {},
    formErrors: [],
  };

  return {
    submission: initialSubmission,
  };
};

export const actions: Actions = {
  default: async ({ request }): Promise<FormSubmission> => {
    const formData = await request.formData();
    const submission = parseFormData(schema, formData).submission();

    if (submission.status !== "success") {
      return submission;
    }

    // Simulate saving to database
    console.log("Saving to database:", submission.value);

    // Reset form on successful submission
    return { ...submission, input: {} };
  },
};
