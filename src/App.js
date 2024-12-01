import React, { useState } from "react";
import "./App.css";

const DynamicForm = () => {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [submittedData, setSubmittedData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Form configurations (simulating API responses)
  const formConfigurations = {
    "User Information": [
      { name: "firstName", type: "text", label: "First Name", required: true },
      { name: "lastName", type: "text", label: "Last Name", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
    "Address Information": [
      { name: "street", type: "text", label: "Street", required: true },
      { name: "city", type: "text", label: "City", required: true },
      {
        name: "state",
        type: "dropdown",
        label: "State",
        options: ["California", "Texas", "New York"],
        required: true,
      },
      { name: "zipCode", type: "text", label: "Zip Code", required: false },
    ],
    "Payment Information": [
      {
        name: "cardNumber",
        type: "text",
        label: "Card Number",
        required: true,
      },
      {
        name: "expiryDate",
        type: "date",
        label: "Expiry Date",
        required: true,
      },
      { name: "cvv", type: "password", label: "CVV", required: true },
      {
        name: "cardholderName",
        type: "text",
        label: "Cardholder Name",
        required: true,
      },
    ],
  };

  const handleFormTypeChange = (event) => {
    const selectedType = event.target.value;
    setFormType(selectedType);
    setFormFields(formConfigurations[selectedType] || []);
    setFormData({});
    setProgress(0);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleInputChange = (fieldName, value) => {
    const updatedData = { ...formData, [fieldName]: value };
    setFormData(updatedData);
    updateProgress(updatedData);
  };

  const updateProgress = (data) => {
    const totalRequired = formFields.filter((field) => field.required).length;
    const completedRequired = formFields.filter(
      (field) => field.required && data[field.name]
    ).length;
    const progressPercentage = totalRequired
      ? (completedRequired / totalRequired) * 100
      : 0;
    setProgress(progressPercentage);
  };

  const handleSubmit = () => {
    if (formFields.every((field) => !field.required || formData[field.name])) {
      setSubmittedData([...submittedData, formData]);
      setFormData({});
      setProgress(0);
      setSuccessMessage("Form submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage("Please fill out all required fields.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleDelete = (index) => {
    const updatedData = submittedData.filter((_, i) => i !== index);
    setSubmittedData(updatedData);
    setSuccessMessage("Entry deleted successfully.");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    handleDelete(index);
  };

  return (
    <div className="form-container">
      <header className="header">User Form</header>
      <div className="form-group">
        <label htmlFor="formType">Select Form Type</label>
        <select id="formType" value={formType} onChange={handleFormTypeChange}>
          <option value="">--Select--</option>
          {Object.keys(formConfigurations).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      {formFields.map((field, index) => (
        <div className="form-group" key={index}>
          <label>
            {field.label}{" "}
            {field.required && <span className="required">*</span>}
          </label>
          {field.type === "dropdown" ? (
            <select
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            >
              <option value="">--Select--</option>
              {field.options.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <button onClick={handleSubmit} className="submit-button">
        Submit
      </button>

      <footer className="footer">Form Actions</footer>

      <table className="data-table">
        <thead>
          <tr>
            {Object.keys(formData).map((key) => (
              <th key={key}>{key}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedData.map((data, index) => (
            <tr key={index}>
              {Object.values(data).map((value, idx) => (
                <td key={idx}>{value}</td>
              ))}
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicForm;
