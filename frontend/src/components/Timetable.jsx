/* eslint-disable no-unused-vars */

import { useEffect } from "react"

/* eslint-disable react/prop-types */
const Timetable = ({centers, bookings, courts}) => {

  useEffect(()=>{

  },[centers, bookings, courts])
  return (
    <div className="w-full bg-green-100">
      <h1 className="text-3xl font-bold text-center">Timetable</h1>
      <div className="flex justify-center">
        <div className="w-1/2">
          <table className="w-full">
            <thead>
              <tr>
                <th>Time</th>
                {courts.map((court) => (
                  <th key={court._id}>{court.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.time}</td>
                  {courts.map((court) => (
                    <td key={court._id}>
                      {booking.court === court._id ? booking.user : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Timetable