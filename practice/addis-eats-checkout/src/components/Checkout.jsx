import { useRef, useState } from "react";
import { validate } from "../utils/validate";
import { submitOrder } from "../services/orderService";

const INITIAL_FORM = {
  name: "",
  phone: "",
  area: "",
  notes: "",
};

const INITIAL_TOUCHED = {
  name: false,
  phone: false,
  area: false,
  notes: false,
};

function Checkout({ total }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [touched, setTouched] = useState(INITIAL_TOUCHED);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const areaRef = useRef(null);
  const notesRef = useRef(null);

  // Derive errors on every render
  const errors = validate(form);

  // Only display an error after the field was touched
  const visibleErrors = {
    name: touched.name ? errors.name : "",
    phone: touched.phone ? errors.phone : "",
    area: touched.area ? errors.area : "",
    notes: touched.notes ? errors.notes : "",
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setRequestError("");
    setSuccessMessage("");
  }

  function handleBlur(event) {
    const { name } = event.target;

    setTouched((current) => ({
      ...current,
      [name]: true,
    }));
  }

  function focusFirstInvalidField(currentErrors) {
    if (currentErrors.name) {
      nameRef.current?.focus();
      return;
    }

    if (currentErrors.phone) {
      phoneRef.current?.focus();
      return;
    }

    if (currentErrors.area) {
      areaRef.current?.focus();
      return;
    }

    if (currentErrors.notes) {
      notesRef.current?.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Prevent double submission
    if (submitting) {
      return;
    }

    const currentErrors = validate(form);

    const hasErrors = Object.values(currentErrors).some(Boolean);

    if (hasErrors) {
      setTouched({
        name: true,
        phone: true,
        area: true,
        notes: true,
      });

      setRequestError("Please correct the highlighted fields.");

      focusFirstInvalidField(currentErrors);

      return;
    }

    setSubmitting(true);
    setRequestError("");
    setSuccessMessage("");

    try {
      const result = await submitOrder({
        ...form,
        total,
      });

      setSuccessMessage(`Order ${result.orderId} submitted successfully!`);

      // Clear only after successful submission
      setForm(INITIAL_FORM);
      setTouched(INITIAL_TOUCHED);
    } catch (error) {
      // IMPORTANT:
      // Do NOT clear the form when the request fails.
      setRequestError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      const latestErrors = validate(form);

      if (Object.values(latestErrors).some(Boolean)) {
        setTouched({
          name: true,
          phone: true,
          area: true,
          notes: true,
        });

        focusFirstInvalidField(latestErrors);
      } else {
        nameRef.current?.focus();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>

        <p>Complete your delivery information below.</p>
      </div>

      {requestError && (
        <div className="request-error" role="alert">
          {requestError}
        </div>
      )}

      {successMessage && (
        <div className="success-message" role="status">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* NAME */}

        <div className="form-group">
          <label htmlFor="name">
            Full name
            <span className="required" aria-hidden="true">
              *
            </span>
          </label>

          <input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="name"
            aria-invalid={Boolean(visibleErrors.name)}
            aria-describedby={visibleErrors.name ? "name-error" : undefined}
          />

          {visibleErrors.name && (
            <p id="name-error" className="field-error" role="alert">
              {visibleErrors.name}
            </p>
          )}
        </div>

        {/* TELEBIRR PHONE */}

        <div className="form-group">
          <label htmlFor="phone">
            TeleBirr phone
            <span className="required" aria-hidden="true">
              *
            </span>
          </label>

          <input
            ref={phoneRef}
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="tel"
            placeholder="0912345678"
            aria-invalid={Boolean(visibleErrors.phone)}
            aria-describedby={
              visibleErrors.phone ? "phone-error" : "phone-help"
            }
          />

          <p id="phone-help" className="help-text">
            Example: 0912345678 or +251912345678
          </p>

          {visibleErrors.phone && (
            <p id="phone-error" className="field-error" role="alert">
              {visibleErrors.phone}
            </p>
          )}
        </div>

        {/* DELIVERY AREA */}

        <div className="form-group">
          <label htmlFor="area">
            Delivery area
            <span className="required" aria-hidden="true">
              *
            </span>
          </label>

          <input
            ref={areaRef}
            id="area"
            name="area"
            type="text"
            value={form.area}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="address-level2"
            placeholder="Bole"
            aria-invalid={Boolean(visibleErrors.area)}
            aria-describedby={visibleErrors.area ? "area-error" : undefined}
          />

          {visibleErrors.area && (
            <p id="area-error" className="field-error" role="alert">
              {visibleErrors.area}
            </p>
          )}
        </div>

        {/* NOTES */}

        <div className="form-group">
          <label htmlFor="notes">
            Notes
            <span className="optional">(optional)</span>
          </label>

          <textarea
            ref={notesRef}
            id="notes"
            name="notes"
            rows="4"
            maxLength="200"
            value={form.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Building, landmark or delivery instruction"
            aria-invalid={Boolean(visibleErrors.notes)}
            aria-describedby={
              visibleErrors.notes ? "notes-error" : "notes-help"
            }
          />

          <p id="notes-help" className="help-text">
            Maximum 200 characters.
          </p>

          {visibleErrors.notes && (
            <p id="notes-error" className="field-error" role="alert">
              {visibleErrors.notes}
            </p>
          )}
        </div>

        {/* SUBMIT */}

        <button type="submit" className="submit-button" disabled={submitting}>
          {submitting
            ? `Submitting... ${total.toLocaleString()} ETB`
            : `Place Order — ${total.toLocaleString()} ETB`}
        </button>
      </form>
    </section>
  );
}

export default Checkout;
