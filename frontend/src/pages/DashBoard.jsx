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
  const [modalVisible, setModalVisible] = useState(false); // For showing the modal
  const [selectedSlot, setSelectedSlot] = useState(null); // To store courtId, time for selected slot
  const [bookedBy, setBookedBy] = useState(""); // For form input

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

  const handleBookingSubmit = async () => {
    if (!selectedSlot || !bookedBy) return;
    const { courtId, startTime, endTime } = selectedSlot;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/b/bookings`,
        {
          courtId,
          date,
          startTime,
          endTime,
          bookedBy,
        },
        { withCredentials: true }
      );
      toast.success("Booking Successful!");
      setModalVisible(false);
      fetchBookings(); // Reload bookings after success
    } catch (error) {
      toast.error("Failed to book the slot");
      console.log(error);
    }
  };

  const openModal = (courtId, startTime, endTime) => {
    setSelectedSlot({ courtId, startTime, endTime });
    setModalVisible(true);
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <Toaster />
      <div className="w-full h-full p-2">
        <div className="border-2 p-2 h-[58rem] rounded-md">
          {/* Filters: Centers, Sports, and Date */}
          <div className="w-full h-24 gap-4 rounded-md grid grid-cols-12">
            <div className="col-span-4 rounded-md">
              <label htmlFor="centerName" className="block mb-2 text-sm font-medium text-gray-900">
                Center Name
              </label>
              <select
                onChange={(e) => fetchSports(e.target.value)}
                id="centerName"
                className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg"
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
              <label htmlFor="centerName" className="block mb-2 text-sm font-medium text-gray-900">
                Sport Name
              </label>
              <select
                onChange={(e) => setSportId(e.target.value)}
                id="sportsName"
                className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg"
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
                <div key={ind} className="h-[48px] flex items-center justify-center">
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
                      <div key={ind2} className="h-[48px] w-52 border-2 p-2 rounded-md flex items-center justify-center">
                        {booking ? (
                          <div className="flex w-full p-2 items-center justify-between">
                            <span>{booking.bookedBy}</span>
                          </div>
                        ) : (
                          <div
                            className="flex w-full p-2 rounded-md bg-green-300 items-center justify-between cursor-pointer"
                            onClick={() =>
                              openModal(court._id, time, times[ind2 + 1]) // Adjust endTime for 1-hour slots
                            }
                          >
                            <span>Available</span>
                            <FaPencilAlt />
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

      {/* Modal for booking */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl mb-4">Book Slot</h2>
            <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <input
              value={bookedBy}
              onChange={(e) => setBookedBy(e.target.value)}
              type="text"
              className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg"
              placeholder="Enter your name"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleBookingSubmit}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoard;
