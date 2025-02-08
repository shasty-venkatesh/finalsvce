import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScheduleImg from "../../image/schedule.png";
import "../../style/schedule.css";
import Header from "./Header";
import axios from "axios";
import { GlobalContext } from "./GlobalContext";
import toast, { Toaster } from "react-hot-toast";

function Schedule() {
  const navigate = useNavigate();
  const { globalId, setGlobalId } = useContext(GlobalContext);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [weight, setWeight] = useState("");
  const [category, setCategory] = useState("");

  const wasteCategories = [
    { item: "Clothes", rate: "2" },
    { item: "Newspaper", rate: "14" },
    { item: "Paper", rate: "14" },
    { item: "Copies/Books", rate: "12" },
    { item: "Cardboard", rate: "RS 8/kg" },
    { item: "PET Bottles/Other Plastic", rate: "8" },
    { item: "Iron", rate: "26" },
    { item: "Steel Utensils", rate: "40" },
    { item: "Aluminium", rate: "105" },
    { item: "Brass", rate: "305" },
    { item: "Copper", rate: "425" },
    { item: "Front Load Fully Automatic Washing Machine", rate: "1350" },
    { item: "Copper Coil", rate: "5600" },
    { item: "Top Load Fully Automatic Washing Machine", rate: "1000" },
    { item: "Semi Automatic Washing Machine (Double Drum)", rate: "750" },
    { item: "Geyser", rate: "20" },
    { item: "Single Door Fridge", rate: "1100" },
    { item: "Double Door Fridge", rate: "1350" },
    { item: "Iron Cooler", rate: "30" },
    { item: "Plastic Cooler", rate: "15" },
    { item: "Printer/Scanner/Fax Machine", rate: "20" },
    { item: "Metal E-waste", rate: "28" },
    { item: "Plastic E-waste", rate: "15" },
    { item: "CRT TV", rate: "200" },
    { item: "Ceiling Fan", rate: "35" },
    { item: "Motors (Copper Wiring)", rate: "35" },
    { item: "Microwave", rate: "350" },
    { item: "UPS", rate: "180" },
    { item: "Inverter/Stabilizer (Copper Coil)", rate: "40" },
    { item: "Battery (Used with inverters)", rate: "81" },
    { item: "Scrap Laptop", rate: "300" },
    { item: "CRT Monitor", rate: "150" },
    { item: "LCD Monitor", rate: "20" },
    { item: "Computer CPU", rate: "225" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resget = await axios.get(
      `http://localhost:3000/api/v1/user/${globalId}`
    );
    const phoneNumber = resget.data.phone;
    const customerName = resget.data.name;
    const orders = Array.isArray(resget.data.order) ? resget.data.order : [];

    await axios.put(`http://localhost:3000/api/v1/user/${globalId}`, {
      order: [
        ...orders,
        {
          name: customerName,
          date,
          time,
          address,
          landmark,
          pincode,
          weight,
          category,
          phone: phoneNumber,
          status: "pending",
        },
      ],
    });

    toast.success("Scheduled your order successfully!");
    setDate("");
    setAddress("");
    setCategory("");
    setLandmark("");
    setPincode("");
    setTime("");
    setWeight("");
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <div className="scheduleform">
        <button className="backbutton" onClick={() => navigate("/home")}>
          ←
        </button>
        <form onSubmit={handleSubmit}>
          <div className="datetime">
            <div>
              <label>Enter Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Select the timing</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select Time</option>
                <option>11AM to 3PM</option>
                <option>3PM to 8PM</option>
              </select>
            </div>
          </div>
          <br />
          <label>Select an Address</label>
          <div>
            <input
              type="text"
              placeholder="Enter Full Address"
              className="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div>
              <input
                type="text"
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                className="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
              />
            </div>
          </div>
          <br />
          <div className="weight">
            <div>
              <label>Estimated Weight</label>
              <select
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              >
                <option value="">Select Weight</option>
                <option value="10">10kg</option>
                <option value="20">20kg</option>
                <option value="50">50kg</option>
                <option value="100">100kg</option>
                <option value="700">700kg</option>
                <option value="1000">1000kg</option>
              </select>
            </div>
            <br />
            <div className="category">
              <label>Category of Waste</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {wasteCategories.map((waste, index) => (
                  <option key={index} value={waste.item}>
                    {waste.item} (₹{waste.rate}/kg)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <br />
          <input type="submit" value="SCHEDULE A PICKUP" />
        </form>
        <img src={ScheduleImg} alt="scheduleimg" className="scheduleimg" />
        <p className="linkCheck">
          To view the scheduled pickups click{" "}
          <Link className="link" to="/checkstatus">
            Check My Pickups
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Schedule;
