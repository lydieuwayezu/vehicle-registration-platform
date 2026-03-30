/**
 * FILE: src/components/FormField.jsx
 *
 * KEY FUNCTIONALITY:
 * A small reusable wrapper component used around every input in the forms.
 * It groups a label, the input (or select), and an error message together
 * so we don't repeat the same HTML structure in every form field.
 *
 * PROPS:
 * - label    (string)    → the text shown above the input
 * - error    (string)    → the validation error message (shown in red below input)
 * - children (ReactNode) → the actual <input> or <select> element
 *
 * USAGE EXAMPLE:
 *   <FormField label="Model" error={errors.model?.message}>
 *     <input {...register('model')} />
 *   </FormField>
 *
 * If `error` is undefined or empty, the error span is not rendered at all.
 */

export default function FormField({ label, error, children }) {
  return (
    <div className="form-field">
      {/* Label displayed above the input */}
      <label>{label}</label>

      {/* The actual input or select element passed in as children */}
      {children}

      {/* Only render the error message if there is one */}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
