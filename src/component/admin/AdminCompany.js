import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { GlobalContext } from "../home/GlobalContext";
import AdminHeader from "../admin/AdminHeader";
import "../../style/admin.css";

const AdminCompany = () => {
  const [companys, setCompanys] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { globalId } = useContext(GlobalContext);

  useEffect(() => {
    fetchWorkers();
  }, []);

  async function fetchWorkers() {
    try {
      const res = await axios.get("http://localhost:3000/api/v1/admin");
      setCompanys(res.data[0]?.company || []);
    } catch (error) {
      console.error("Error fetching workers:", error);
      setCompanys([]);
    }
  }

  async function handleAddToJoin(company) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/admin/${globalId}`
      );
      const otherCompany = res.data.company.filter(
        (item) => item.email !== company.email
      );
      const updatedCompany = { ...company, status: "added" };

      await axios.put(`http://localhost:3000/api/v1/admin/${globalId}`, {
        company: [...otherCompany, updatedCompany],
      });
      setCompanys([...otherCompany, updatedCompany]);

      const addcompany = { ...company, order: [] };
      await axios.post("http://localhost:3000/api/v1/company", addcompany);
    } catch (error) {
      console.error("Error adding company:", error);
    }
  }

  async function handleRemoveWorker(company) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/admin/${globalId}`
      );
      const updatedCompanys = res.data.company.filter(
        (item) => item.email !== company.email
      );

      await axios.put(`http://localhost:3000/api/v1/admin/${globalId}`, {
        company: updatedCompanys,
      });
      setCompanys(updatedCompanys);

      await axios.delete(`http://localhost:3000/api/v1/company/${company._id}`);
    } catch (error) {
      console.error("Error removing company:", error);
    }
  }

  const filteredCompany = companys.filter((company) => {
    if (filter !== "all" && company.status !== filter) return false;
    if (search && !company.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div>
      <AdminHeader />
      <div className="table-container">
        <div className="filter-container">
          <h1>Company status</h1>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label>Filter by Status: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="added">Added</option>
          </select>
        </div>
        <div className="table-wrapper">
          <table className="scrap-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Gst Number</th>
                <th>Address</th>
                <th>Landmark</th>
                <th>Pincode</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompany.length > 0 ? (
                filteredCompany.map((entry, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "even-row" : "odd-row"}
                  >
                    <td>{entry.name}</td>
                    <td>{entry.gstNumber}</td>
                    <td>{entry.address}</td>
                    <td>{entry.landmark}</td>
                    <td>{entry.pincode}</td>
                    <td>{entry.phone}</td>
                    <td>{entry.email}</td>
                    <td>
                      {entry.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleAddToJoin(entry)}
                            className="btn-update"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => handleRemoveWorker(entry)}
                            className="btn-delete"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRemoveWorker(entry)}
                          className="btn-delete"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      padding: "20px",
                    }}
                  >
                    No companys available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCompany;
