import React, { useState } from 'react';
// You would typically import your global CSS file in your main application entry point (e.g., index.js or App.js)
// import './styles.css'; // Example import for a global CSS file

// Main App component
const App = () => {
  // State for form fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [growerType, setGrowerType] = useState('Continuing');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [individualFarmer, setIndividualFarmer] = useState(false);
  const [society, setSociety] = useState('');
  const [sector, setSector] = useState('');
  const [club, setClub] = useState('');
  const [hectares, setHectares] = useState(0);
  const [labors, setLabors] = useState(1);
  const [mBeds, setMBeds] = useState(0);
  const [rBeds, setRBeds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // State for barns data
  const [barns, setBarns] = useState([{ length: 1, width: 0, tiers: 0, slt: false, tv: false, bv: false, completed: false }]);

  // Function to add a new barn row
  const addBarnRow = () => {
    setBarns([...barns, { length: 0, width: 0, tiers: 0, slt: false, tv: false, bv: false, completed: false }]);
  };

  // Function to handle changes in barn fields
  const handleBarnChange = (index, field, value) => {
    const newBarns = [...barns];
    newBarns[index][field] = value;
    setBarns(newBarns);
  };

  // Function to delete a barn row
  const deleteBarnRow = (index) => {
    const newBarns = barns.filter((_, i) => i !== index);
    setBarns(newBarns);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend or handle it further
    console.log({
      firstName, middleName, lastName, growerType, registrationNumber,
      gender, phoneNumber, individualFarmer, society, sector, club,
      hectares, labors, mBeds, rBeds, isActive, barns
    });
    // You could also close the modal or show a success message here
  };

  return (
    <div className="app-container">
      <div className="form-card">
        {/* Close button */}
        <button
          className="close-button"
          onClick={() => console.log('Close form')} // Replace with actual close logic
        >
          &times;
        </button>

        <h2 className="form-heading">Register Grower</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid-layout">
            {/* Profile Image Section */}
            <div className="profile-image-section">
              <div className="profile-image-container">
                {/* Placeholder for image - replace with actual image or upload functionality */}
                <img
                  src="https://placehold.co/128x128/E0E0E0/A0A0A0?text=Profile"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/E0E0E0/A0A0A0?text=Profile'; }}
                />
              </div>
              <p className="profile-image-text">Upload Photo</p>
            </div>

            {/* Form Fields - Column 1 */}
            <div className="form-column">
              <div>
                <label htmlFor="firstName" className="form-label">First Name :</label>
                <input
                  type="text"
                  id="firstName"
                  className="form-input-field"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="middleName" className="form-label">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  className="form-input-field"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-input-field"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="gender" className="form-label">Gender</label>
                <select
                  id="gender"
                  className="form-input-field form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select ...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Form Fields - Column 2 */}
            <div className="form-column">
              <div>
                <label htmlFor="growerType" className="form-label">Grower Type</label>
                <select
                  id="growerType"
                  className="form-input-field form-select"
                  value={growerType}
                  onChange={(e) => setGrowerType(e.target.value)}
                >
                  <option value="Continuing">Continuing</option>
                  <option value="New">New</option>
                </select>
              </div>
              <div>
                <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
                <input
                  type="text"
                  id="registrationNumber"
                  className="form-input-field"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="society" className="form-label">Society</label>
                <select
                  id="society"
                  className="form-input-field form-select"
                  value={society}
                  onChange={(e) => setSociety(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Farmers Co-op Ltd">Farmers Co-op Ltd</option>
                  <option value="Agricultural Union">Agricultural Union</option>
                </select>
              </div>
              <div>
                <label htmlFor="sector" className="form-label">Sector</label>
                <select
                  id="sector"
                  className="form-input-field form-select"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Horticulture">Horticulture</option>
                </select>
              </div>
              <div>
                <label htmlFor="club" className="form-label">Club</label>
                <select
                  id="club"
                  className="form-input-field form-select"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Crop Growers Union">Crop Growers Union</option>
                  <option value="Livestock Farmers">Livestock Farmers</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row-two-cols">
            <div>
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="e.g. 07XXXXXXXXX"
                className="form-input-field"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="individualFarmer"
                className="form-checkbox"
                checked={individualFarmer}
                onChange={(e) => setIndividualFarmer(e.target.checked)}
              />
              <label htmlFor="individualFarmer" className="form-label ml-2">Individual Farmer</label>
            </div>
          </div>

          <div className="form-row-four-cols">
            <div>
              <label htmlFor="hectares" className="form-label">Hectares</label>
              <input
                type="number"
                id="hectares"
                className="form-input-field"
                value={hectares}
                onChange={(e) => setHectares(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="labors" className="form-label">Labors</label>
              <input
                type="number"
                id="labors"
                className="form-input-field"
                value={labors}
                onChange={(e) => setLabors(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="mBeds" className="form-label">M/Beds</label>
              <input
                type="number"
                id="mBeds"
                className="form-input-field"
                value={mBeds}
                onChange={(e) => setMBeds(Number(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="rBeds" className="form-label">R/Beds</label>
              <input
                type="number"
                id="rBeds"
                className="form-input-field"
                value={rBeds}
                onChange={(e) => setRBeds(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="isActive"
              className="form-checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <label htmlFor="isActive" className="form-label ml-2">Is Active</label>
          </div>

          {/* Barns Section */}
          <div className="barns-section">
            <h3 className="barns-heading">Barns</h3>
            <div className="overflow-x-auto">
              <table className="barns-table">
                <thead className="barns-table-header">
                  <tr>
                    <th scope="col" className="table-header-cell"></th>
                    <th scope="col" className="table-header-cell">LENGTH</th>
                    <th scope="col" className="table-header-cell">WIDTH</th>
                    <th scope="col" className="table-header-cell">TIERS</th>
                    <th scope="col" className="table-header-cell">SLT?</th>
                    <th scope="col" className="table-header-cell">TV?</th>
                    <th scope="col" className="table-header-cell">BV?</th>
                    <th scope="col" className="table-header-cell">COMPLETED?</th>
                    <th scope="col" className="table-header-cell"></th>
                  </tr>
                </thead>
                <tbody className="barns-table-body">
                  {barns.map((barn, index) => (
                    <tr key={index}>
                      <td className="table-cell-text">{index + 1}</td>
                      <td className="table-cell-input">
                        <input
                          type="number"
                          className="barn-input-field"
                          value={barn.length}
                          onChange={(e) => handleBarnChange(index, 'length', Number(e.target.value))}
                        />
                      </td>
                      <td className="table-cell-input">
                        <input
                          type="number"
                          className="barn-input-field"
                          value={barn.width}
                          onChange={(e) => handleBarnChange(index, 'width', Number(e.target.value))}
                        />
                      </td>
                      <td className="table-cell-input">
                        <input
                          type="number"
                          className="barn-input-field"
                          value={barn.tiers}
                          onChange={(e) => handleBarnChange(index, 'tiers', Number(e.target.value))}
                        />
                      </td>
                      <td className="table-cell-checkbox">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={barn.slt}
                          onChange={(e) => handleBarnChange(index, 'slt', e.target.checked)}
                        />
                      </td>
                      <td className="table-cell-checkbox">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={barn.tv}
                          onChange={(e) => handleBarnChange(index, 'tv', e.target.checked)}
                        />
                      </td>
                      <td className="table-cell-checkbox">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={barn.bv}
                          onChange={(e) => handleBarnChange(index, 'bv', e.target.checked)}
                        />
                      </td>
                      <td className="table-cell-checkbox">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={barn.completed}
                          onChange={(e) => handleBarnChange(index, 'completed', e.target.checked)}
                        />
                      </td>
                      <td className="table-cell-action">
                        <button
                          type="button"
                          onClick={() => deleteBarnRow(index)}
                          className="delete-button"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="add-row-button-container">
              <button
                type="button"
                onClick={addBarnRow}
                className="add-row-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Row
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-button-container">
            <button
              type="submit"
              className="submit-button"
            >
              Register Grower
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
