import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FaAngleRight } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';

const FeeForm = ({ onTransactionSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    purpose: ''
  });
  const [errors, setErrors] = useState({});
  const [transaction, setTransaction] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false); // Track download state

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Invalid amount';
    if (!formData.purpose) newErrors.purpose = 'Select purpose';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newTransaction = {
        ...formData,
        id: uuidv4(),
        date: new Date().toISOString(),
        amount: parseFloat(formData.amount)
      };
      
      setTransaction(newTransaction);
      setIsDownloaded(false); // Reset download state when generating a new receipt
      onTransactionSubmit(newTransaction);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Live validation
    let errorMessage = "";
    if (name === "name" && !value.trim()) errorMessage = "Name is required";
    if (name === "email" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) errorMessage = "Invalid email";
    if (name === "amount" && (isNaN(value) || value <= 0)) errorMessage = "Invalid amount";
    if (name === "purpose" && !value) errorMessage = "Select a purpose";

    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  const handleDownload = () => {
    const confirmDownload = window.confirm("Are you sure you want to download the receipt?");
    if (confirmDownload) {
      setTimeout(() => {
        alert("Receipt downloaded successfully!");
        setTransaction(null); // Hide the download button
        setIsDownloaded(true);
        setFormData({ name: '', email: '', amount: '', purpose: '' }); // Reset form
      }, 1000); // Small delay for better UX
    }
  };

  return (
    <div className="container mt-4">
      {/* Back to Home Button */}
      <Link to="/" className="educate_link_btn backToHomeFromFeesCollection color-primary h6 mb-48">
        <FaAngleRight /> Back To Home
      </Link>

      <div className="card feesFormCard p-4 mt-3">
        <h3 className="text-center mb-4">Fee Payment Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              name="amount"
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              value={formData.amount}
              onChange={handleChange}
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Purpose</label>
            <select
              name="purpose"
              className={`form-select ${errors.purpose ? 'is-invalid' : ''}`}
              value={formData.purpose}
              onChange={handleChange}
            >
              <option value="">Select Purpose</option>
              <option value="Admission">Admission Fee</option>
              <option value="Monthly">Monthly Fee</option>
              <option value="Exam">Exam Fee</option>
            </select>
            {errors.purpose && <div className="invalid-feedback">{errors.purpose}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 generateReceipt" disabled={!!transaction}>
            {transaction ? "Processing..." : "Generate Receipt"}
          </button>
        </form>

        {transaction && !isDownloaded && (
          <div className="text-center mt-4">
            <PDFDownloadLink
              document={<Invoice transaction={transaction} />}
              fileName={`receipt_${transaction.id}.pdf`}
              className="btn btn-success"
              onClick={handleDownload}
            >
              {({ loading }) => (loading ? 'Generating...' : 'Download Receipt')}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeForm;
