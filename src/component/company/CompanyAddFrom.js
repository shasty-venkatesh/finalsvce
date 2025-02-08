import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../../style/companyform.css";
import Header from "../home/Header";
import companyformbg from "../../image/companyformbg.png";

function CompanyAddForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    gstNumber: "",
    address: "",
    landmark: "",
    pincode: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    console.log(`Field: ${e.target.name}, Value: ${e.target.value}`); // Debugging
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return; // Prevent multiple submissions

      setLoading(true);
      try {
        const generateRandomPassword = () =>
          Math.floor(1000 + Math.random() * 9000).toString();

        const newCompany = {
          ...formData,
          status: "pending",
          password: generateRandomPassword(),
        };

        // Fetch admin data
        const res = await axios.get("http://localhost:3000/api/v1/admin");
        const admin = res.data[0];

        if (!admin) {
          toast.error("Admin data not found!");
          return;
        }

        // Check if email already exists
        const companyExists = admin.company.some(
          (item) => item.email === newCompany.email
        );
        if (companyExists) {
          toast.error("Worker with this email already exists!");
          return;
        }

        // Update company data
        const updatedCompany = [...admin.company, newCompany];

        await axios.put(`http://localhost:3000/api/v1/admin/${admin._id}`, {
          company: updatedCompany,
        });

        toast.success("Your application has been submitted successfully!");
      } catch (error) {
        toast.error("An error occurred while submitting your application.");
        console.error("Submission error:", error);
      } finally {
        setLoading(false);
      }
    },
    [formData, loading]
  );

  return (
    <div>
      <Toaster />
      <Header />
      <div className="companyform">
        <button className="backbutton" onClick={() => navigate("/")}>←</button>
      </div>
      <div className="companyform">
        <form onSubmit={handleSubmit}>
          <div className="namegst">
            <div>
              <label>Enter Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Enter GST Number</label>
              <input
                type="text"
                name="gstNumber"
                placeholder="GST Number"
                value={formData.gstNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <label>Enter Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={formData.landmark}
            onChange={handleChange}
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            className="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          <div className="namegst">
            <div>
              <label>Enter Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Enter Phone Number</label>
              <input
                type="number"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <input type="submit" value="SUBMIT DETAILS" disabled={loading} />
        </form>
        <div>
          <img src={companyformbg} alt="companyimg" className="companyimg" />
        </div>
      </div>
    </div>
  );
}

export default CompanyAddForm;
