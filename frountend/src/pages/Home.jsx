import React, { useState, useEffect } from "react";
import MedicineCard from "../components/MedicineCard";

function Home({ search = "" }) {

  const [medicines, setMedicines] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [sortType, setSortType] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔥 FETCH DATA */
  useEffect(() => {
    fetch("https://medassist-ai-healthcare-chatbot.onrender.com")
      .then(res => res.json())
      .then(data => {
        setMedicines(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* 🔍 SEARCH */
  let filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  /* 🏢 FILTER */
  if (companyFilter) {
    filtered = filtered.filter((m) => m.company === companyFilter);
  }

  /* 🔽 SORT */
  if (sortType === "priceLow") {
    filtered = [...filtered].sort((a,b)=> a.average_price_inr - b.average_price_inr);
  }

  if (sortType === "priceHigh") {
    filtered = [...filtered].sort((a,b)=> b.average_price_inr - a.average_price_inr);
  }

  if (sortType === "effectiveness") {
    filtered = [...filtered].sort((a,b)=> b.effectiveness_score - a.effectiveness_score);
  }

  /* 🏢 DYNAMIC COMPANY LIST */
  const companies = [...new Set(medicines.map(m => m.company))];

  return (
    <div className="container mt-4">

      {/* 🔥 FILTER BAR */}
      <div className="row mb-4 g-3">

        {/* COMPANY FILTER */}
        <div className="col-md-4">
          <select
            className="form-select shadow-sm"
            onChange={(e)=>setCompanyFilter(e.target.value)}
          >
            <option value="">All Companies</option>
            {companies.map((c,i)=>(
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* SORT */}
        <div className="col-md-4">
          <select
            className="form-select shadow-sm"
            onChange={(e)=>setSortType(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="effectiveness">Effectiveness</option>
          </select>
        </div>

      </div>

      {/* ⏳ LOADING */}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading medicines...</p>
        </div>
      )}

      {/* ❌ NO DATA */}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-muted mt-5">
          <h5>No medicines found 😢</h5>
        </div>
      )}

      {/* 💊 MEDICINES GRID */}
      <div className="row">
        {filtered.map((med,index)=>(
          <div className="col-md-3 mb-4" key={index}>
            <MedicineCard medicine={med}/>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;
