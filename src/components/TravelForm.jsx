"use client";

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { calculateTotalDays } from "../utils/dateUtils";
import { formatDateVerbose } from "../utils/toDateStringUtils";
import { formatToTwoDecimals } from "../utils/costPerDayUtils";
import usePreventScroll from "../Hooks/usePreventScroll";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const generateReservationCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
};

const emptyFlight = {
  airline: "",
  includedBaggage: "23",
  cabinClassSeat: "",
  date: "",
  destination_from: "",
  destination_to: "",
  time_boarding: "",
  time_arriving: "",
  flight_number: "",
  cost: "",
};

const emptyAccommodation = {
  check_in_date: "",
  check_out_date: "",
  total_days: "",
  hotel: "",
  address: "",
  check_in_time: "",
  check_out_time: "",
  total_cost: "",
  cost_per_day: "",
};

const emptyHireCompany = {
  hire_company: "",
  car: "",
  pickup_date: "",
  pickup_location: "",
  pickup_time: "",
  drop_off_date: "",
  total_days: "",
  drop_off_location: "",
  drop_off_time: "",
  total_cost: "",
  cost_per_day: "",
};

const TravelForm = ({ onSubmit, onPreview, initialData, setMisc, misc }) => {
  const inputRef = useRef(null);
  const [reservationCode, setReservationCode] = useState(
    "FIFO" + generateReservationCode()
  );

  const regenerateCode = () => {
    setReservationCode("FIFO" + generateReservationCode());
  };
  usePreventScroll(inputRef);

  const [traveller, setTraveller] = useState({
    first_name: "",
    last_name: "",
    name_ref: "",
    mr_name: "Mr",
    frequent_flyer_number: "",
  });
  const [flights, setFlights] = useState([emptyFlight]);
  const [accommodations, setAccommodations] = useState([emptyAccommodation]);
  const [hirecompanies, setHirecompanies] = useState([emptyHireCompany]);

  const handleChangeMisc = (e) => {
    const { name, value } = e.target;
    setMisc((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    if (initialData) {
      setTraveller(
        initialData.traveller || {
          first_name: "",
          last_name: "",
          name_ref: "",
          mr_name: "Mr",
          frequent_flyer_number: "",
        }
      );

      // Handle conversion from old format to new format
      if (initialData.flight) {
        // Old format with single flight
        const outboundFlight = {
          airline: initialData.flight.airline || "",
          includedBaggage: initialData.flight.includedBaggage || "23",
          cabinClassSeat: initialData.flight.cabinClassSeat || "",
          date: initialData.flight.date || "",
          destination_from: initialData.flight.destination_from || "",
          destination_to: initialData.flight.destination_to || "",
          time_boarding: initialData.flight.time_boarding || "",
          time_arriving: initialData.flight.time_arriving || "",
          flight_number: initialData.flight.flight_number || "",
          cost: initialData.flight.cost || "",
        };

        const returnFlight = initialData.flight.return_airline
          ? {
              airline: initialData.flight.return_airline || "",
              includedBaggage: initialData.flight.includedBaggage2 || "23",
              cabinClassSeat: initialData.flight.cabinClassSeat2 || "",
              date: initialData.flight.return_date || "",
              destination_from:
                initialData.flight.return_destination_from || "",
              destination_to: initialData.flight.return_destination_to || "",
              time_boarding: initialData.flight.return_time_boarding || "",
              time_arriving: initialData.flight.return_time_arriving || "",
              flight_number: initialData.flight.return_flight_number || "",
              cost: initialData.flight.return_cost || "",
            }
          : null;

        const newFlights = [outboundFlight];
        if (returnFlight) newFlights.push(returnFlight);

        setFlights(newFlights);
      } else {
        // New format with flights array
        setFlights(
          initialData.flights && initialData.flights.length > 0
            ? initialData.flights
            : [emptyFlight]
        );
      }

      // Handle conversion for accommodation
      if (initialData.accommodation) {
        // Old format with single accommodation
        setAccommodations([initialData.accommodation]);
      } else {
        // New format with accommodations array
        setAccommodations(
          initialData.accommodations && initialData.accommodations.length > 0
            ? initialData.accommodations
            : [emptyAccommodation]
        );
      }

      // Handle conversion for hire company
      if (initialData.hirecompany) {
        // Old format with single hire company
        setHirecompanies([initialData.hirecompany]);
      } else {
        // New format with hirecompanies array
        setHirecompanies(
          initialData.hirecompanies && initialData.hirecompanies.length > 0
            ? initialData.hirecompanies
            : [emptyHireCompany]
        );
      }
    }
  }, [initialData]);

  // Update total days for accommodations
  useEffect(() => {
    setAccommodations((prevAccommodations) =>
      prevAccommodations.map((accommodation) => {
        const totalDays = calculateTotalDays(
          accommodation.check_in_date,
          accommodation.check_out_date
        );
        const costPerDay = formatToTwoDecimals(
          accommodation.total_cost,
          totalDays
        );
        return {
          ...accommodation,
          total_days: totalDays,
          cost_per_day: costPerDay,
        };
      })
    );
  }, [
    accommodations
      .map((a) => a.check_in_date + a.check_out_date + a.total_cost)
      .join(","),
  ]);

  // Update total days for hire companies
  useEffect(() => {
    setHirecompanies((prevHirecompanies) =>
      prevHirecompanies.map((hirecompany) => {
        const totalDays = calculateTotalDays(
          hirecompany.pickup_date,
          hirecompany.drop_off_date
        );
        const costPerDay = formatToTwoDecimals(
          hirecompany.total_cost,
          totalDays
        );
        return {
          ...hirecompany,
          total_days: totalDays,
          cost_per_day: costPerDay,
        };
      })
    );
  }, [
    hirecompanies
      .map((h) => h.pickup_date + h.drop_off_date + h.total_cost)
      .join(","),
  ]);

  const handleChange = (e, setState, index, array) => {
    const { name, value } = e.target;
    setState((prevState) => {
      const newArray = [...prevState];
      newArray[index] = { ...newArray[index], [name]: value };
      return newArray;
    });
  };

  const handleTravellerChange = (e) => {
    const { name, value } = e.target;
    setTraveller((prevState) => ({ ...prevState, [name]: value }));
  };

  const addItem = (setState, emptyItem) => {
    setState((prevState) => [...prevState, { ...emptyItem }]);
  };

  const removeItem = (setState, index) => {
    setState((prevState) => {
      if (prevState.length <= 1) return prevState;
      return prevState.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ traveller, flights, accommodations, hirecompanies });
  };

  const handlePreview = (e) => {
    e.preventDefault();
    onPreview({
      traveller,
      flights,
      accommodations,
      hirecompanies,
      misc,
      reservationCode,
    });
  };

  const handleReset = () => {
    setTraveller({
      first_name: "",
      last_name: "",
      mr_name: "",
      name_ref: "",
      frequent_flyer_number: "",
    });
    setFlights([emptyFlight]);
    setAccommodations([emptyAccommodation]);
    setHirecompanies([emptyHireCompany]);
    setMisc({
      misc_text: "",
      misc_date: "",
      destination_from: "",
      destination_to: "",
      time_boarding: "",
      time_arriving: "",
      misc_cost: "",
      GST: true,
    });
  };
  const inputClass = `block w-full rounded-xl border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  return (
    <div className="w-full max-w-4xl mx-auto p-3 md:p-4 bg-white shadow-lg rounded-lg font-sans">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {/* Traveller Details */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
              Traveller Details
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={traveller.first_name}
                  onChange={handleTravellerChange}
                  autoComplete="given-name"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={traveller.last_name}
                  onChange={handleTravellerChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="mr_name"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Mr/Mrs/Doctor/Other
                </label>
                <input
                  id="mr_name"
                  name="mr_name"
                  type="text"
                  value={traveller.mr_name || "MR"}
                  onChange={handleTravellerChange}
                  autoComplete="given-name"
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="name_ref"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Name Ref
                </label>
                <input
                  id="name_ref"
                  name="name_ref"
                  type="text"
                  value={traveller.name_ref}
                  onChange={handleTravellerChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="frequent_flyer_number"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Frequent Flyer Number
                </label>
                <input
                  id="frequent_flyer_number"
                  name="frequent_flyer_number"
                  type="text"
                  value={traveller.frequent_flyer_number}
                  onChange={handleTravellerChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Reservation Code */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800  tracking-tight">
              Reservation Code
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="reservation_code"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                ></label>
                <input
                  id="reservation_code"
                  name="reservation_code"
                  type="text"
                  value={reservationCode}
                  readOnly
                  className={`${inputClass} bg-slate-200`}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={regenerateCode}
                  className="border p-2 w-full rounded-xl bg-gray-500 hover:bg-gray-100  text-sm font-medium text-gray-100 ease-in-out duration-300 hover:text-gray-500 transition-al active:scale-90"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </div>

          {/* Flights */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                Flights
              </h2>
              <button
                type="button"
                onClick={() => addItem(setFlights, emptyFlight)}
                className="border border-indigo-500 p-2 px-5 rounded-xl bg-white hover:bg-indigo-100 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Flight
              </button>
            </div>

            {flights.map((flight, index) => (
              <div
                key={index}
                className="mb-8 border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Flight #{index + 1}
                  </h3>
                  {flights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(setFlights, index)}
                      className="border border-red-500 p-2 px-5 rounded-xl bg-white hover:bg-red-100 text-sm font-medium text-red-500 hover:text-red-700 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor={`airline-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Airline
                    </label>
                    <input
                      id={`airline-${index}`}
                      name="airline"
                      type="text"
                      value={flight.airline}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`includedBaggage-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Included Baggage
                    </label>
                    <input
                      id={`includedBaggage-${index}`}
                      name="includedBaggage"
                      type="text"
                      value={flight.includedBaggage || 23}
                      placeholder="write amount in kg"
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`cabinClassSeat-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Cabin Class / Seat
                    </label>
                    <input
                      id={`cabinClassSeat-${index}`}
                      name="cabinClassSeat"
                      type="text"
                      value={flight.cabinClassSeat}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor={`date-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Date
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        id={`date-${index}`}
                        name="date"
                        type="date"
                        value={flight.date}
                        onChange={(e) => handleChange(e, setFlights, index)}
                        className="rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <span className="text-gray-500 text-xs">
                        {formatDateVerbose(flight.date)}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`destination_from-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Destination From
                    </label>
                    <input
                      id={`destination_from-${index}`}
                      name="destination_from"
                      type="text"
                      value={flight.destination_from}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`destination_to-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Destination To
                    </label>
                    <input
                      id={`destination_to-${index}`}
                      name="destination_to"
                      type="text"
                      value={flight.destination_to}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`time_boarding-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Time Boarding
                    </label>
                    <input
                      id={`time_boarding-${index}`}
                      name="time_boarding"
                      type="time"
                      value={flight.time_boarding}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`time_arriving-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Time Arriving
                    </label>
                    <input
                      id={`time_arriving-${index}`}
                      name="time_arriving"
                      type="time"
                      value={flight.time_arriving}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`flight_number-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Flight Number
                    </label>
                    <input
                      id={`flight_number-${index}`}
                      name="flight_number"
                      type="text"
                      value={flight.flight_number}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`cost-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Cost
                    </label>
                    <input
                      id={`cost-${index}`}
                      name="cost"
                      type="text"
                      value={flight.cost}
                      onChange={(e) => handleChange(e, setFlights, index)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Accommodation */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                Accommodation
              </h2>

              <button
                type="button"
                onClick={() => addItem(setAccommodations, emptyFlight)}
                className="border border-indigo-500 p-2 px-5 rounded-xl bg-white hover:bg-indigo-100 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Accommodation
              </button>
            </div>

            {accommodations.map((accommodation, index) => (
              <div
                key={index}
                className="mb-8 border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Accommodation #{index + 1}
                  </h3>
                  {accommodations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(setAccommodations, index)}
                      className="border border-red-500 p-2 px-5 rounded-xl bg-white hover:bg-red-100 text-sm font-medium text-red-500 hover:text-red-700 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`checkindate-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Check-in Date
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        id={`checkindate-${index}`}
                        name="check_in_date"
                        type="date"
                        value={accommodation.check_in_date}
                        onChange={(e) =>
                          handleChange(e, setAccommodations, index)
                        }
                        className="rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <span className="text-gray-500 text-xs">
                        {formatDateVerbose(accommodation.check_in_date)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor={`checkoutdate-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Check-out Date
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        id={`checkoutdate-${index}`}
                        name="check_out_date"
                        type="date"
                        value={accommodation.check_out_date}
                        onChange={(e) =>
                          handleChange(e, setAccommodations, index)
                        }
                        className="rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <span className="text-gray-500 text-xs">
                        {formatDateVerbose(accommodation.check_out_date)}
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`hotel-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Hotel
                    </label>
                    <input
                      id={`hotel-${index}`}
                      name="hotel"
                      type="text"
                      value={accommodation.hotel}
                      onChange={(e) =>
                        handleChange(e, setAccommodations, index)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`address-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Address
                    </label>
                    <input
                      id={`address-${index}`}
                      name="address"
                      type="text"
                      value={accommodation.address}
                      onChange={(e) =>
                        handleChange(e, setAccommodations, index)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`checkintime-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Check-in Time
                    </label>
                    <input
                      id={`checkintime-${index}`}
                      name="check_in_time"
                      type="time"
                      value={accommodation.check_in_time}
                      onChange={(e) =>
                        handleChange(e, setAccommodations, index)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`checkouttime-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Check-out Time
                    </label>
                    <input
                      id={`checkouttime-${index}`}
                      name="check_out_time"
                      type="time"
                      value={accommodation.check_out_time}
                      onChange={(e) =>
                        handleChange(e, setAccommodations, index)
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`costperday-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Cost Per Day
                    </label>
                    <input
                      id={`costperday-${index}`}
                      name="total_cost"
                      type="text"
                      value={accommodation.total_cost}
                      onChange={(e) =>
                        handleChange(e, setAccommodations, index)
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hire Company */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                Hire Company
              </h2>

              <button
                type="button"
                onClick={() => addItem(setHirecompanies, emptyFlight)}
                className="border border-indigo-500 p-2 px-5 rounded-xl bg-white hover:bg-indigo-100 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Hire Company
              </button>
            </div>

            {hirecompanies.map((hirecompany, index) => (
              <div
                key={index}
                className="mb-8 border-b pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">
                    Hire Company #{index + 1}
                  </h3>
                  {hirecompanies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(setHirecompanies, index)}
                      className="border border-red-500 p-2 px-5 rounded-xl bg-white hover:bg-red-100 text-sm font-medium text-red-500 hover:text-red-700 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`hire_company-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Hire Company
                    </label>
                    <input
                      id={`hire_company-${index}`}
                      name="hire_company"
                      type="text"
                      value={hirecompany.hire_company}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`car-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Car
                    </label>
                    <input
                      id={`car-${index}`}
                      name="car"
                      type="text"
                      value={hirecompany.car}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`pickup_date-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Pickup Date
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        id={`pickup_date-${index}`}
                        name="pickup_date"
                        type="date"
                        value={hirecompany.pickup_date}
                        onChange={(e) =>
                          handleChange(e, setHirecompanies, index)
                        }
                        className="rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <span className="text-gray-500 text-xs">
                        {formatDateVerbose(hirecompany.pickup_date)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor={`dropoff_date-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Drop-off Date
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        id={`dropoff_date-${index}`}
                        name="drop_off_date"
                        type="date"
                        value={hirecompany.drop_off_date}
                        onChange={(e) =>
                          handleChange(e, setHirecompanies, index)
                        }
                        className="rounded-lg border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <span className="text-gray-500 text-xs">
                        {formatDateVerbose(hirecompany.drop_off_date)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor={`pickup_location-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Pickup Location
                    </label>
                    <input
                      id={`pickup_location-${index}`}
                      name="pickup_location"
                      type="text"
                      value={hirecompany.pickup_location}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`dropoff_location-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Drop-off Location
                    </label>
                    <input
                      id={`dropoff_location-${index}`}
                      name="drop_off_location"
                      type="text"
                      value={hirecompany.drop_off_location}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`pickup_time-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Pickup Time
                    </label>
                    <input
                      id={`pickup_time-${index}`}
                      name="pickup_time"
                      type="time"
                      value={hirecompany.pickup_time}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`dropoff_time-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Drop-off Time
                    </label>
                    <input
                      id={`dropoff_time-${index}`}
                      name="drop_off_time"
                      type="time"
                      value={hirecompany.drop_off_time}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`cost_per_day-${index}`}
                      className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                    >
                      Cost Per Day
                    </label>
                    <input
                      id={`cost_per_day-${index}`}
                      name="total_cost"
                      type="text"
                      value={hirecompany.total_cost}
                      onChange={(e) => handleChange(e, setHirecompanies, index)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Miscellaneous Logistics */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 tracking-tight">
              Miscellaneous Logistics
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="misc_text"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Description
                </label>
                <input
                  id="misc_text"
                  name="misc_text"
                  type="text"
                  value={misc.misc_text}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="misc_date"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Date
                </label>
                <input
                  id="misc_date"
                  name="misc_date"
                  type="date"
                  value={misc.misc_date}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="destination_from"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Destination From
                </label>
                <input
                  id="destination_from"
                  name="destination_from"
                  type="text"
                  value={misc.destination_from}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="destination_to"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Destination To
                </label>
                <input
                  id="destination_to"
                  name="destination_to"
                  type="text"
                  value={misc.destination_to}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="time_boarding"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Time Boarding
                </label>
                <input
                  id="time_boarding"
                  name="time_boarding"
                  type="time"
                  value={misc.time_boarding}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="time_arriving"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Time Arriving
                </label>
                <input
                  id="time_arriving"
                  name="time_arriving"
                  type="time"
                  value={misc.time_arriving}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="misc_cost"
                  className="block text-sm font-medium text-gray-700 tracking-wide mb-1"
                >
                  Total Cost
                </label>
                <input
                  id="misc_cost"
                  name="misc_cost"
                  ref={inputRef}
                  type="number"
                  value={misc.misc_cost}
                  onChange={handleChangeMisc}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="GST"
              name="GST"
              checked={misc.GST}
              ref={inputRef}
              onChange={(e) =>
                handleChangeMisc({
                  target: { name: e.target.name, value: e.target.checked },
                })
              }
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="GST"
              className="text-sm font-medium text-gray-700 tracking-wide"
            >
              Add GST
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="reset"
              onClick={handleReset}
              className="border border-rose-500 p-2 px-5 rounded-xl bg-white hover:bg-rose-100 text-sm font-medium text-rose-600 hover:text-rose-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handlePreview}
              className="border border-indigo-500 p-2 px-5 rounded-xl bg-white hover:bg-indigo-100 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-300 active:scale-90 flex items-center justify-center gap-1"
            >
              Preview
            </button>
          </div>
        </div>
      </form>
      <style>{`
        @media (max-width: 640px) {
          .max-w-3xl {
            padding: 1rem;
          }
          .text-xl {
            font-size: 1.125rem;
          }
          .sm\\:grid-cols-2, .sm\\:grid-cols-6 {
            grid-template-columns: 1fr;
          }
          .rounded-lg {
            border-radius: 0.5rem;
          }
          input, button {
            font-size: 0.875rem;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Roboto', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default TravelForm;
