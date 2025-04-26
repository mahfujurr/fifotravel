"use client"

import { useState } from "react"
import TravelForm from "./components/TravelForm"
import Invoice from "./components/Invoice"
import "./index.css"
function App() {
  const [formData, setFormData] = useState({
    traveller: {
      first_name: "",
      last_name: "",
      name_ref: "",
      frequent_flyer_number: "",
    },
    flights: [],
    accommodations: [],
    hirecompanies: [],
  })
  const [isPreview, setIsPreview] = useState(false)
  const [misc, setMisc] = useState({
    misc_text: "",
    misc_cost: "",
    GST: true,
  })
  const handleFormSubmit = (data) => {
    setFormData(data)
    setIsPreview(false)
  }

  const handlePreview = (data) => {
    setFormData(data)
    setIsPreview(true)
  }
  const handleEdit = () => {
    setIsPreview(false)
  }

  return (
    <div className="p-4 bg-white text-black fontpoppins">
      {!isPreview ? (
        <TravelForm
          onSubmit={handleFormSubmit}
          onPreview={handlePreview}
          initialData={formData}
          misc={misc}
          setMisc={setMisc}
        />
      ) : (
        <Invoice data={formData} onEdit={handleEdit} misc={misc} setMisc={setMisc} />
      )}
    </div>
  )
}

export default App
