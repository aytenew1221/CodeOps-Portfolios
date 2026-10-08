import { useState } from "react";

function DeliveryForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const telebirrPattern = /^(?:\+251|0)9\d{8}$/;

  const isNameValid = formData.name.trim().length >= 2;

  const isPhoneValid = telebirrPattern.test(formData.phone.trim());

  const isAreaValid = formData.area.trim().length >= 2;

  const isFormValid = isNameValid && isPhoneValid && isAreaValid;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    setSubmitted(true);

    setFormData({
      name: "",
      phone: "",
      area: "",
    });
  };

  return (
    <section className="delivery-section">
      <h2>TeleBirr Delivery</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="delivery-name">Full Name</label>

        <input
          id="delivery-name"
          name="name"
          type="text"
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <label htmlFor="delivery-phone">TeleBirr Phone Number</label>

        <input
          id="delivery-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="09xxxxxxxx or +2519xxxxxxxx"
        />

        {formData.phone && !isPhoneValid && (
          <p className="error">Enter a valid Ethiopian TeleBirr number.</p>
        )}

        <label htmlFor="delivery-area">Delivery Area</label>

        <input
          id="delivery-area"
          name="area"
          type="text"
          autoComplete="address-level2"
          value={formData.area}
          onChange={handleChange}
          placeholder="e.g. Bole, Addis Ababa"
        />

        <button type="submit" disabled={!isFormValid}>
          Place Delivery Order
        </button>
      </form>

      {submitted && (
        <p className="success">
          Your delivery information was submitted successfully!
        </p>
      )}
    </section>
  );
}

export default DeliveryForm;
