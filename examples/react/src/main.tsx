import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Form } from "./Form.tsx";

const defaultValues = {
  name: "",
  age: undefined,
  acceptTerms: false,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Form defaultValues={defaultValues} />
  </StrictMode>,
);
