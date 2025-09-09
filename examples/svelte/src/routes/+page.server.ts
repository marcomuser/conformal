import { parseWithSchema, type Submission } from "conformal";
import * as z from "zod";
import * as zf from "conformal/zod";
import type { Actions, PageServerLoad } from "./$types";

const schema = z.object({
  name: zf.string(),
  age: zf.number(),
  acceptTerms: zf.boolean(),
});

type FormSubmission = Submission<z.infer<typeof schema>>;

export const actions: Actions<FormSubmission> = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const submission = parseWithSchema(schema, formData).submission();

    if (submission.status !== "success") {
      return submission;
    }

    // Simulate saving to database
    console.log("Saving to database:", submission.value);

    return submission;
  },
};

export const load: PageServerLoad = async () => {
  const defaultSubmission: FormSubmission = {
    status: "idle",
    input: {},
    fieldErrors: {},
    formErrors: [],
  };

  return {
    submission: defaultSubmission,
  };
};
