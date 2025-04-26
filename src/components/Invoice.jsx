"use client";

/* eslint-disable react/prop-types */
import { formatDateToDMY, ToAMPM } from "../utils/dateUtils";
import "../assets/button_print.css";

const formatNumberWithThousandSeparator = (value) => {
  const sanitizedValue =
    value === undefined ||
    value === null ||
    value === "" ||
    isNaN(Number(value))
      ? 0
      : Number(value);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(sanitizedValue);
};

const Invoice = ({ data, onEdit, misc }) => {
  const { traveller, flights, accommodations, hirecompanies, reservationCode } =
    data;

  // Calculate total costs
  const calculateFlightsCost = () => {
    return flights.reduce((total, flight) => {
      return total + Number(flight.cost || 0);
    }, 0);
  };

  const calculateAccommodationsCost = () => {
    return accommodations.reduce((total, accommodation) => {
      const costPerDay = Number(accommodation.cost_per_day || 0);
      const totalDays = Number(accommodation.total_days || 0);
      return total + costPerDay * totalDays;
    }, 0);
  };

  const calculateHireCompaniesCost = () => {
    return hirecompanies.reduce((total, hirecompany) => {
      const costPerDay = Number(hirecompany.cost_per_day || 0);
      const totalDays = Number(hirecompany.total_days || 0);
      return total + costPerDay * totalDays;
    }, 0);
  };

  // Cost calculations
  const total_flight_cost = calculateFlightsCost().toFixed(2);
  const total_accommodation_cost = calculateAccommodationsCost().toFixed(2);
  const total_hire_company_cost = calculateHireCompaniesCost().toFixed(2);
  const misc_cost = Number(misc?.misc_cost || 0).toFixed(2);

  // GST and total calculations
  const GST = misc?.GST === true ? 1.1 : 1;

  const total_cost = (
    Number.parseFloat(total_flight_cost) * 1.1 +
    Number.parseFloat(total_accommodation_cost) * 1.1 +
    Number.parseFloat(total_hire_company_cost) * 1.1 +
    Number.parseFloat(misc_cost) * 1.1
  ).toFixed(2);

  const total_cost_with_gst = (Number.parseFloat(total_cost) * GST).toFixed(2);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-4 md:p-0 min-h-screen">
      <div className="invoice">
        <div className="flex items-end justify-between border-b pb-2">
          <img className="w-64" src={"/logo.png"} alt="Virgin Australia" />
          <span className="text-gray-500 ml-4 text-sm">
            FIFO TRAVEL PTY LTD ABN 68 677 297 442
          </span>
        </div>

        <h2 className="text-base font-semibold my-2">
          E-Ticket, Itinerary, Receipts and Tax Invoice
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Guest Information */}
          <div className="border rounded p-3">
            <h3 className="font-bold mb-2 text-sm">Guest Information</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-0.5 text-gray-600 text-xs">GUEST NAME</td>
                  <td className="text-xs">
                    {traveller.last_name.toUpperCase()}/
                    {traveller.first_name.toUpperCase()} {traveller.mr_name || "Mr"}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 text-gray-600 text-xs">NAME REF</td>
                  <td className="text-xs"> {traveller.name_ref || "-"}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-gray-600 text-xs">
                    FREQUENT FLYER NUMBER
                  </td>
                  <td className="text-xs">
                    {traveller.frequent_flyer_number || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5 text-gray-600 text-xs">ISSUE DATE</td>
                  <td className="text-xs">{formatDateToDMY(new Date())}</td>
                </tr>
                <tr>
                  <td className="py-0.5 text-gray-600 text-xs">
                    ISSUING AGENT
                  </td>
                  <td className="text-xs">FIFO TRAVEL AGENCY</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Reservation Number */}
          <div className="px-3">
            <h3 className="font-bold mb-2 text-sm">Reservation Number</h3>
            <div className="text-center text-lg font-bold border">
              {reservationCode || "HKLQAD"}
            </div>
          </div>
        </div>

        {/* Flights Details */}
        {flights && flights.length > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2 text-sm">Flight Details</h3>
            <table className="w-full border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    FLIGHT
                  </th>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    DEPART
                  </th>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    ARRIVE
                  </th>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    CABIN CLASS / SEAT
                  </th>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    INCLUDED BAGGAGE
                  </th>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    COST
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td className="border p-1.5">
                      <div>{flight.flight_number}</div>
                      <div className="text-gray-500">Ok to fly</div>
                      <div className="text-gray-500">Operated by:</div>
                      <div>{flight.airline}</div>
                    </td>
                    <td className="border p-1.5">
                      <div>{flight.destination_from}</div>
                      <div>{formatDateToDMY(flight.date)}</div>
                      <div>{ToAMPM(flight.time_boarding)}</div>
                    </td>
                    <td className="border p-1.5">
                      <div>{flight.destination_to}</div>
                      <div>{formatDateToDMY(flight.date)}</div>
                      <div>{ToAMPM(flight.time_arriving)}</div>
                    </td>
                    <td className="border p-1.5">
                      <div>{flight.cabinClassSeat}</div>
                    </td>
                    <td className="border p-1.5">{flight.includedBaggage}kg</td>
                    <td className="border p-1.5">
                      <div>
                        $
                        {formatNumberWithThousandSeparator(
                          Number(flight.cost || 0) * 1.1
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr className="font-semibold bg-gray-100">
                  <td colSpan={5} className="border p-1.5 text-right">
                    Grand Total
                  </td>
                  <td className="border p-1.5">
                    $
                    {formatNumberWithThousandSeparator(
                      flights.reduce(
                        (total, flight) =>
                          total + Number(flight.cost || 0) * 1.1,
                        0
                      )
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Accommodation Details */}
        {accommodations &&
          accommodations.length > 0 &&
          accommodations.reduce(
            (total, acc) =>
              total +
              Number(acc.cost_per_day || 0) * Number(acc.total_days || 0) * 1.1,
            0
          ) > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-sm">Accommodation Details</h3>
              <table className="w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      HOTEL
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      ADDRESS
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      CHECK IN
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      CHECK OUT
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      TOTAL DAYS
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      COST PER DAY
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      TOTAL COST
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {accommodations.map((accommodation, index) => (
                    <tr key={index}>
                      <td className="border p-1.5">{accommodation.hotel}</td>
                      <td className="border p-1.5">{accommodation.address}</td>
                      <td className="border p-1.5">
                        {formatDateToDMY(accommodation.check_in_date)}{" "}
                        {ToAMPM(accommodation.check_in_time)}
                      </td>
                      <td className="border p-1.5">
                        {formatDateToDMY(accommodation.check_out_date)}{" "}
                        {ToAMPM(accommodation.check_out_time)}
                      </td>
                      <td className="border p-1.5">
                        {accommodation.total_days}
                      </td>
                      <td className="border p-1.5">
                        $
                        {formatNumberWithThousandSeparator(
                          Number(accommodation.cost_per_day || 0) * 1.1
                        )}
                      </td>
                      <td className="border p-1.5">
                        $
                        {formatNumberWithThousandSeparator(
                          Number(accommodation.cost_per_day || 0) *
                            Number(accommodation.total_days || 0) *
                            1.1
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Grand Total Row */}
                  <tr className="font-semibold bg-gray-100">
                    <td colSpan={6} className="border p-1.5 text-right">
                      Grand Total
                    </td>
                    <td className="border p-1.5">
                      $
                      {formatNumberWithThousandSeparator(
                        accommodations.reduce(
                          (total, acc) =>
                            total +
                            Number(acc.cost_per_day || 0) *
                              Number(acc.total_days || 0) *
                              1.1,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Hire Car Details */}
        {hirecompanies &&
          hirecompanies.length > 0 &&
          hirecompanies.reduce(
            (total, hire) =>
              total +
              Number(hire.cost_per_day || 0) *
                Number(hire.total_days || 0) *
                1.1,
            0
          ) > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-sm">Hire Car Details</h3>
              <table className="w-full border text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      COMPANY
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      CAR
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      PICK UP
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      DROP OFF
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      TOTAL DAYS
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      COST PER DAY
                    </th>
                    <th className="border p-1.5 text-left text-xs font-medium">
                      TOTAL COST
                    </th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {hirecompanies.map((hirecompany, index) => (
                    <tr key={index}>
                      <td className="border p-1.5">
                        {hirecompany.hire_company}
                      </td>
                      <td className="border p-1.5">{hirecompany.car}</td>
                      <td className="border p-1.5">
                        {hirecompany.pickup_location}{" "}
                        {formatDateToDMY(hirecompany.pickup_date)}{" "}
                        {ToAMPM(hirecompany.pickup_time)}
                      </td>
                      <td className="border p-1.5">
                        {hirecompany.drop_off_location}{" "}
                        {formatDateToDMY(hirecompany.drop_off_date)}{" "}
                        {ToAMPM(hirecompany.drop_off_time)}
                      </td>
                      <td className="border p-1.5">{hirecompany.total_days}</td>
                      <td className="border p-1.5">
                        $
                        {formatNumberWithThousandSeparator(
                          Number(hirecompany.cost_per_day || 0) * 1.1
                        )}
                      </td>
                      <td className="border p-1.5">
                        $
                        {formatNumberWithThousandSeparator(
                          Number(hirecompany.cost_per_day || 0) *
                            Number(hirecompany.total_days || 0) *
                            1.1
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Grand Total Row */}
                  <tr className="font-semibold bg-gray-100">
                    <td colSpan={6} className="border p-1.5 text-right">
                      Grand Total
                    </td>
                    <td className="border p-1.5">
                      $
                      {formatNumberWithThousandSeparator(
                        hirecompanies.reduce(
                          (total, hire) =>
                            total +
                            Number(hire.cost_per_day || 0) *
                              Number(hire.total_days || 0) *
                              1.1,
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        {/* Miscellaneous Logistics */}
        {Number.parseFloat(misc_cost) > 0 && (
          <div className="mt-4">
            <h3 className="font-bold mb-2 text-sm">Miscellaneous Logistics</h3>
            <table className="w-full border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    DESCRIPTION
                  </th>
                  <th className="border p-1.5 text-left text-xs font-medium">
                    TOTAL COST
                  </th>
                </tr>
              </thead>
              <tbody className="text-xs">
                <tr>
                  <td className="border p-1.5">{misc.misc_text}</td>
                  <td className="border p-1.5">
                    ${formatNumberWithThousandSeparator(misc_cost * 1.1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Cost Summary */}
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-sm">Cost Summary</h3>
          <table className="w-full border text-sm">
            <tbody className="text-xs">
              <tr>
                <td className="border p-1.5 font-bold">GST 10%</td>
                <td className="border p-1.5">
                  $
                  {formatNumberWithThousandSeparator(
                    Number.parseFloat(total_cost_with_gst) -
                      Number.parseFloat(total_cost)
                  )}
                </td>
              </tr>
              <tr>
                <td className="border p-1.5 font-bold">
                  Grand Total Including GST
                </td>
                <td className="border p-1.5">
                  ${formatNumberWithThousandSeparator(total_cost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          This is not a boarding pass
        </div>

        <div className="flex items-center justify-between gap-x-6 mt-6 print-hide">
          <button
            type="reset"
            onClick={onEdit}
             className="border border-green-500 p-2 px-5 rounded-xl bg-white hover:bg-green-100 text-sm font-medium text-green-600 hover:text-green-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => window.print()}
             className="border border-indigo-500 p-2 px-5 rounded-xl bg-white hover:bg-indigo-100 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
          >
            Print
          </button>
        </div>
      </div>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
