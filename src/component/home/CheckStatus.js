import CheckStatusImg from "../../image/checkstatus.png";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/checkstatus.css";
import Header from "./Header";
import calendarIcon from "../../image/calendar.png";
import cancelIcon from "../../image/cancel.png";
import completedIcon from "../../image/completed.png";
import axios from "axios";
import { GlobalContext } from "./GlobalContext";
import { format } from "date-fns";


const wasteCategories = [
  { item: "Clothes", rate: 2 },
  { item: "Newspaper", rate: 14 },
  { item: "Paper", rate: 14 },
  { item: "Copies/Books", rate: 12 },
  { item: "Cardboard", rate: 8 },
  { item: "PET Bottles/Other Plastic", rate: 8 },
  { item: "Iron", rate: 26 },
  { item: "Steel Utensils", rate: 40 },
  { item: "Aluminium", rate: 105 },
  { item: "Brass", rate: 305 },
  { item: "Copper", rate: 425 },
  { item: "Front Load Fully Automatic Washing Machine", rate: 1350 },
  { item: "Copper Coil", rate: 5600 },
  { item: "Top Load Fully Automatic Washing Machine", rate: 1000 },
  { item: "Semi Automatic Washing Machine (Double Drum)", rate: 750 },
  { item: "Geyser", rate: 20 },
  { item: "Single Door Fridge", rate: 1100 },
  { item: "Double Door Fridge", rate: 1350 },
  { item: "Iron Cooler", rate: 30 },
  { item: "Plastic Cooler", rate: 15 },
  { item: "Printer/Scanner/Fax Machine", rate: 20 },
  { item: "Metal E-waste", rate: 28 },
  { item: "Plastic E-waste", rate: 15 },
  { item: "CRT TV", rate: 200 },
  { item: "Ceiling Fan", rate: 35 },
  { item: "Motors (Copper Wiring)", rate: 35 },
  { item: "Microwave", rate: 350 },
  { item: "UPS", rate: 180 },
  { item: "Inverter/Stabilizer (Copper Coil)", rate: 40 },
  { item: "Battery (Used with inverters)", rate: 81 },
  { item: "Scrap Laptop", rate: 300 },
  { item: "CRT Monitor", rate: 150 },
  { item: "LCD Monitor", rate: 20 },
  { item: "Computer CPU", rate: 225 }
];

function CheckStatus() {
  const [scheduleStatuses, setScheduleStatuses] = useState([]);
  const [canceledStatuses, setCanceledStatuses] = useState([]);
  const [completedStatuses, setCompletedStatuses] = useState([]);
  const { globalId, setGlobalId } = useContext(GlobalContext);
  useEffect(() => {
    async function handleSchedule() {
      const res = await axios.get(
        `http://localhost:3000/api/v1/user/${globalId}`
      );
      const order = res.data.order;
      const filteredOrdersforschedue = order.filter(
        (item) => item.status === "pending"
      );
      setScheduleStatuses(filteredOrdersforschedue);
      const filteredOrdersforcancel = order.filter(
        (item) => item.status === "canceled"
      );
      setCanceledStatuses(filteredOrdersforcancel);
      const filteredOrdersforcompleted = order.filter(
        (item) => item.status === "completed"
      );
      setCompletedStatuses(filteredOrdersforcompleted);
    }
    handleSchedule();
  }, []);

  const navigate = useNavigate();
  const [clickSchedule, setClickSchedule] = useState([true, false, false]);
  return (
    <div className="checkstatuspage">
      <Header />
      <button className="backbutton" onClick={() => navigate("/home")}>
        ←
      </button>
      <div className="checkstatus">
        <div className="statusbutton">
          <button
            className={!clickSchedule[0] ? "schedule" : "scheduleactive"}
            onClick={() => setClickSchedule([true, false, false])}
          >
            SCHEDULED
          </button>
          <button
            className={!clickSchedule[1] ? "cancel" : "cancelactive"}
            onClick={() => {
              setClickSchedule([false, true, false]);
            }}
          >
            CANCELLED
          </button>
          <button
            className={!clickSchedule[2] ? "completed" : "completedactive"}
            onClick={() => {
              setClickSchedule([false, false, true]);
            }}
          >
            COMPLETED
          </button>
        </div>
        <div className="list">
          {clickSchedule[0] ? (
            scheduleStatuses.length > 0 ? (
              <ScheduleStatus scheduleStatuses={scheduleStatuses} />
            ) : (
              <p className="noschedulestatus">Nothing Scheduled Pickups!</p>
            )
          ) : null}
          {clickSchedule[1] ? (
            canceledStatuses.length > 0 ? (
              <CancelStatus canceledStatuses={canceledStatuses} />
            ) : (
              <p className="nocancelstatus">
                There is no Cancelled Pickup at this moment
              </p>
            )
          ) : null}
          {clickSchedule[2] ? (
            completedStatuses.length > 0 ? (
              <CompletedStatus completedStatuses={completedStatuses} />
            ) : (
              <p className="nocompletedstatus">No Completed Pickups!</p>
            )
          ) : null}
        </div>

        <hr className="line" />
        <button
          className="schedulebutton"
          onClick={() => {
            navigate("/schedule");
          }}
        >
          SCHEDULE ANOTHER PICKUP
        </button>
        <img
          src={CheckStatusImg}
          alt="checkstatusimg"
          className="checkstatusimg"
        />
      </div>
    </div>
  );
}

function ScheduleStatus({ scheduleStatuses }) {
  return (
    <div>
      <ul>
        {scheduleStatuses.map((item,index) => {
                const categoryRate = wasteCategories.find((w) => w.item === item.category)?.rate || 0;
                const totalPrice = categoryRate * (parseFloat(item.weight) || 0); // Ensure weight is a number
          return (
            <li className="schedulelist">
              <div className="schedulelistheader">
                <img src={calendarIcon} alt="icon" />
                <div>
                  <p className="scheduleaddress">{item.address}</p>
                  <div className="category">
                    <p>Category : {item.category}</p>
                    <p className="price">Price : ₹{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="scheduletime">
                  {format(new Date(item.date), "eeee, MMMM dd, yyyy")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CancelStatus({ canceledStatuses }) {
  return (
    <div>
      <ul>
        {canceledStatuses.map((item) => {
          return (
            <li className="cancellist">
              <div className="cancellistheader">
                <img src={cancelIcon} alt="icon" />
                <div>
                  <p className="canceladdress">{item.address}</p>
                  <div className="cancelcategory">
                    <p>Category : {item.category}</p>
                    <p className="cancelprice">Price : {item.price}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="canceltime">
                  {" "}
                  {format(new Date(item.date), "eeee, MMMM dd, yyyy")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CompletedStatus({ completedStatuses }) {
  return (
    <div>
      <ul>
        {completedStatuses.map((item) => {
          return (
            <li className="completedlist">
              <div className="completedlistheader">
                <img src={completedIcon} alt="icon" />
                <div>
                  <p className="completedaddress">{item.address}</p>
                  <div className="completedcategory">
                    <p>Category : {item.category}</p>
                    <p className="completedprice">Price : {item.price}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="completedtime">
                  {" "}
                  {format(new Date(item.date), "eeee, MMMM dd, yyyy")}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CheckStatus;
