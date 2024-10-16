import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { times } from "../../time";
import { FaPencilAlt } from "react-icons/fa";

const DashBoard = () => {
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [date, setDate] = useState("");
  const [centerId, setCenterId] = useState("");
  const [sportId, setSportId] = useState("");
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);

  const fetchCenters = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/b/centers`,
        { withCredentials: true }
      );
      setCenters(res.data);
    } catch (error) {
      toast.error("Failed to fetch centers");
      console.log(error);
    }
  };

  const fetchSports = async (centerId) => {
    try {
      setCenterId(centerId);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/b/c/${centerId}`,
        { withCredentials: true }
      );
      setSports(res.data);
    } catch (error) {
      toast.error("Failed to fetch sports");
      console.log(error);
    }
  };

  const fetchCourts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/b/courts?sportId=${sportId}&centerId=${centerId}`,
        { withCredentials: true }
      );
      setCourts(res.data);
    } catch (error) {
      toast.error("Failed to fetch courts");
      console.log(error);
    }
  };

  const fetchBookings = async () => {
    try {
      await fetchCourts();
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/b/bookings?centerId=${centerId}&sportId=${sportId}&date=${date}`,
        { withCredentials: true }
      );
      setBookings(res.data);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.log(error);
    }
  };

  const findBooking = (courtId, time) => {
    return bookings.find(
      (booking) =>
        booking.court === courtId && booking.startTime === time
    );
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <Toaster />
      <div className="w-full h-full p-2">
        <div className="border-2 p-2 h-full rounded-md">
          {/* Filters: Centers, Sports, and Date */}
          <div className="w-full h-16 gap-4 rounded-md grid grid-cols-12">
            <div className="col-span-4 rounded-md">
              <label
                htmlFor="centerName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Center Name
              </label>
              <select
                onChange={(e) => fetchSports(e.target.value)}
                id="centerName"
                className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={-1}>Choose a Center Name</option>
                {centers.map((center) => (
                  <option key={center._id} value={center._id}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-4 rounded-md">
              <label
                htmlFor="centerName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sport Name
              </label>
              <select
                onChange={(e) => setSportId(e.target.value)}
                id="sportsName"
                className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Choose a Sports Name</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 flex items-center justify-center">
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                name="date"
                id="date"
                min={new Date().toISOString().split("T")[0]}
                className="border p-2 rounded-md"
              />
            </div>

            <div className="col-span-2 flex items-center justify-center">
              <button
                onClick={fetchBookings}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </div>

          {/* Timetable */}
          <div className="w-full mt-4 rounded-md overflow-y-scroll flex">
            {/* Time Slots */}
            <div className="w-[10%]">
              <div className="h-[48px]"></div>
              {times.map((time, ind) => (
                <div
                  key={ind}
                  className="h-[48px] flex items-center justify-center"
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Courts and Bookings */}
            <div className="w-full flex gap-2 rounded-md">
              {courts.map((court) => (
                <div key={court._id}>
                  <div className="h-[48px] w-52 border-2 flex items-center justify-center rounded-md">
                    {court.name}
                  </div>
                  {times.map((time, ind2) => {
                    const booking = findBooking(court._id, time);
                    return (
                      <div
                        key={ind2}
                        className="h-[48px] w-52 border-2 p-2 rounded-md flex items-center justify-center"
                      >
                        {booking ? (
                          <div className="flex w-full p-2 items-center justify-between">
                            <span>{booking.bookedBy}</span>
                          </div>
                        ) : (
                          <div className="flex w-full p-2 rounded-md bg-green-300 items-center justify-between">
                            <span>Available</span>
                            <FaPencilAlt className="cursor-pointer" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
