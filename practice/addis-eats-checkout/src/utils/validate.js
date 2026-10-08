export function validate(form) {
  const errors = {
    name: "",
    phone: "",
    area: "",
    notes: "",
  };

  // -------------------------
  // Name validation
  // -------------------------

  const name = form.name.trim();

  if (!name) {
    errors.name = "Full name is required.";
  } else if (name.length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }

  // -------------------------
  // TeleBirr phone validation
  // -------------------------

  const phone = form.phone.trim().replace(/\s+/g, "");

  const ethiopianPhoneRegex = /^(?:\+251|0)9\d{8}$/;

  if (!phone) {
    errors.phone = "TeleBirr phone number is required.";
  } else if (!ethiopianPhoneRegex.test(phone)) {
    errors.phone =
      "Enter a valid Ethiopian phone number, for example 0912345678.";
  }

  // -------------------------
  // Delivery area validation
  // -------------------------

  const area = form.area.trim();

  if (!area) {
    errors.area = "Delivery area is required.";
  } else if (area.length < 2) {
    errors.area = "Delivery area must be at least 2 characters.";
  }

  // -------------------------
  // Notes validation
  // -------------------------

  const notes = form.notes.trim();

  if (notes.length > 200) {
    errors.notes = "Notes cannot be more than 200 characters.";
  }

  return errors;
}
