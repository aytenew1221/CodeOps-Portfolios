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
        <label htmlFor="name">Full Name</label>

        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
        />

        <label htmlFor="phone">TeleBirr Phone Number</label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="09xxxxxxxx or +2519xxxxxxxx"
        />

        {formData.phone && !isPhoneValid && (
          <p className="error">Enter a valid Ethiopian TeleBirr number.</p>
        )}

        <label htmlFor="area">Delivery Area</label>

        <input
          id="area"
          name="area"
          type="text"
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
