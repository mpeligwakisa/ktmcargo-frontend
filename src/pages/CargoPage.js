import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useCargoStore } from "../store/useCargoStore";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { X, Search, Pencil, Trash2, Plane, Ship, Truck } from "lucide-react";
import './CargoPage.css';

function CargoPage() {
  const { user } = useAuthStore();
  const {
    cargos,
    clients = [],  // ✅ safe default
    measurements = [], // ✅ safe default
    fetchDropdowns,
    fetchCargos,
    locations = [],   // ✅ safe default
    transportModes = [], // ✅ safe default
    addCargo,
    updateCargo,
    deleteCargo,
    setSelectedCargo,
    selectedCargo,
    meta,
  } = useCargoStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    client_id: "",
    cargo_name: "",
    quantity: "",
    measurement_id: "",
    unit_type: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    value: "",
    origin_location_id: "",
    destination_location_id: "",
    transport_id: "",
    packaging: "",
    special_instructions: "",
  });
  const [errors, setErrors] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if(user && user.location && user.location.name!== "Head Office"){
      setFormData((prev) => ({
        ...prev,
        origin_location_id: user.location.id,
      }));
    }
    fetchCargos();
    fetchDropdowns();
  }, [fetchCargos, fetchDropdowns, user, setFormData]);

  // 🟩 Handle measurement (unit) change
  const handleMeasurementChange = (e) => {
    const selected = measurements.find(
      (m) => m.id === parseInt(e.target.value)
    );
    setFormData((prev) => ({
      ...prev,
      measurement_id: e.target.value,
      unit_type: selected?.unit || "",
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🧮 Compute the correct weight_cbm before sending
  let weight_cbm = 0;
  if (formData.unit_type === "KG") {
    weight_cbm = formData.weight || 0;
  } else if (formData.unit_type === "CBM") {
    const { length, width, height } = formData;
    weight_cbm =
      length && width && height
        ? ((length * width * height) / 1000).toFixed(2)
        : 0;
  }

  const payload = {
    ...formData,
    weight_cbm, // ✅ single field to match backend column
  };

    if (selectedCargo) {
      await updateCargo(selectedCargo.id, payload);
    } else {
      await addCargo(payload);
    }
    clearForm();
    setIsModalOpen(false);
  };

  const clearForm = () => {
    setFormData({
      tracking_number: "",
      client_id: "",
      cargo_name: "",
      quantity: "",
      measurement_id: "",
      unit_type: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      category: "",
      container_number: "",
      special_instructions: "",
      origin_location_id: "",
      destination_location_id: "",
      transport_id: "",
      status: "",
      eta: "",
      // client_id: "",
      // cargo_name: "",
      // quantity: "",
      // measurement_id: "",
      // unit_type: "",
      // weight: "",
      // length: "",
      // width: "",
      // height: "",
      // value: "",
      // origin_location_id: "",
      // destination_location_id: "",
      // transport_id: "",
      // packaging: "",
      // instructions: "",
    });
    setSelectedCargo(null);
  };

  const handleCargoSelect = (cargo) => {
    setSelectedCargo(cargo);
    setFormData({
      tracking_number: cargo.tracking_number || "",
      client_id: cargo.client_id || "",
      cargo_name: cargo.cargo_name || "",
      quantity: cargo.quantity || "",
      measurement_id: cargo.measurement_id || "",
      unit_type: cargo.unit_type || "",
      weight: cargo.unit_type === "KG" ? cargo.weight_cbm : "",
      length: cargo.unit_type === "CBM" ? cargo.length : "",
      width: cargo.unit_type === "CBM" ? cargo.width : "",
      height: cargo.unit_type === "CBM" ? cargo.height : "",
      category: cargo.category || "",
      container_number: cargo.container_number || "",
      special_instructions: cargo.special_instructions || "",
      origin_location_id: cargo.origin_location_id || "",
      destination_location_id: cargo.destination_location_id || "",
      transport_id: cargo.transport_id || "",
      status: cargo.status || "",
      eta: cargo.eta || "",
    // client_id: cargo.client_id || "",
    // cargo_name: cargo.cargo_name || "",
    // quantity: cargo.quantity || "",
    // measurement_id: cargo.measurement_id || "",
    // unit_type: cargo.unit_type || "",
    // weight: cargo.weight || "",
    // length: cargo.length || "",
    // width: cargo.width || "",
    // height: cargo.height || "",
    // value: cargo.value || "",
    // origin_location_id: cargo.origin_location_id || cargo.origin_location_id?.id || "",
    // destination_location_id: cargo.destination_location_id || cargo.destination_location_id?.id || "",
    // transport_id: cargo.transport_id || cargo.transport_id?.id || "",
    // packaging: cargo.packaging || "",
    // instructions: cargo.instructions || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="cargo-container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cargo Management</h1>
        <Button onClick={() => { clearForm(); setIsModalOpen(true); }}>Add New Cargo</Button>
      </div>
      
      {/* Cargo Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <Card className="modal-container">
          <CardHeader className="modal-header">
            <CardTitle className="modal-title">
              {selectedCargo ? "Edit Cargo" : "Add New Cargo"}
            </CardTitle>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="modal-close-btn"
              >
                <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="modal-content">
          <form id="cargo-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="form-grid">
              {/* Tracking Number should be auto generated */}
              <input
                type="text"
                id="tracking_number"
                value={formData.tracking_number || "Auto-Generated"}
                readOnly
                placeholder="Tracking Number"
                className="form-input"
              />

              {/* Client (required) */}
              <select
                id="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>

              {/* Cargo Description */}
              <input
                type="text"
                id="cargo_name"
                value={formData.cargo_name}
                onChange={handleChange}
                placeholder="Cargo Description"
                className="form-input"
                required
              />

              <input
                type="number"
                id="container_number"
                value={formData.container_number}
                onChange={handleChange}
                placeholder="Container Number"
                className="form-input"
              />

              {/* Category */}
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="textiles">Textiles</option>
                <option value="machinery">Machinery</option>
                <option value="automotive">Automotive</option>
                <option value="consumer-goods">Consumer Goods</option>
                <option value="pharmaceuticals">Pharmaceuticals</option>
              </select>

              {/* Quantity */}
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className="form-input"
              />

              {/* Unit Type Toggle */}
              <select
                id="measurement_id"
                value={formData.measurement_id}
                onChange={
                  (e) => {
                    const selected = measurements.find(m => m.id === parseInt(e.target.value));
                    setFormData({
                      ...formData,
                      measurement_id: e.target.value,
                      unit_type: selected?.unit || "",
                      weight_cbm: "", // reset value when unit changes
                    length: "",
                    width: "",
                    height: "",
                    weight: ""
                      //unit_type: selectedMeasurement ? selectedMeasurement.unit_type : ""
                    });
                  }
                }
                className="form-input"
                required
              >
                <option value="">Select Measurement</option>
                {measurements.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.unit})
                  </option>
                ))}
              </select>

              {/* Show weight if kg */}
              {formData.unit_type === "KG" && (
                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight (kg)"
                  className="form-input"
                />
              )}

              {/* Show dimension fields if cbm */}
              {formData.unit_type === "CBM" && (
                <div className="cbm-grid">
                  <input
                    type="number"
                    id="length"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="Length (cm)"
                    className="form-input"
                  />
                  <input
                    type="number"
                    id="width"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="Width (cm)"
                    className="form-input"
                  />
                  <input
                    type="number"
                    id="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Height (cm)"
                    className="form-input"
                  />
                  <div className="cbm-result">
                    CBM:{" "}
                    {formData.length && formData.width && formData.height
                      ? ((formData.length * formData.width * formData.height) / 1000).toFixed(2)
                      : 0}
                  </div>
                </div>
              )}

              <input
                type="number"
                id="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="Declared Value (USD)"
                className="form-input"
              />

              {/* Origin Country (location logic) */}
              {user?.location?.name === "Head Office" ? (
                <select
                  id="origin_location_id"
                  value={formData.origin_location_id}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Origin Location</option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.country}-{loc.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <input
                    type="text"
                    value={` ${user?.location?.name}`}
                    readOnly
                    className="form-input bg-gray-100 cursor-not-allowed"
                  />
                  <input
                    type="hidden"
                    id="origin_location_id"
                    value={formData.origin_location_id}
                    onChange={handleChange}
                  /> 
                </>
              )}

              {/* destination_location_id to display all locations regardless of user*/}
              <select
                id="destination_location_id"
                value={formData.destination_location_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select destination_location_id</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>

              {/* Transport Mode from transport page*/}
              <select
                id="transport_id"
                value={formData.transport_id}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Transport Mode</option>
                {transportModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>

              <select id="packaging" value={formData.packaging} onChange={handleChange} className="form-input">
                <option value="">Select Packaging</option>
                <option value="container-20ft">20ft Container</option>
                <option value="container-40ft">40ft Container</option>
                <option value="cartons">Cartons</option>
                <option value="pallets">Pallets</option>
                <option value="crates">Crates</option>
              </select>

              {/* Status */}
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <textarea
                id="special_instructions"
                value={formData.special_instructions}
                onChange={handleChange}
                placeholder="Special Instructions"
                className="input w-full"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={clearForm}>
                  Clear
                </Button>
                <Button type="submit">{selectedCargo ? "Update Cargo" : "Save Cargo"}</Button>
            </div>
          </form>

            {/* <form id="cargo-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="form-grid">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Cargo Description"
                  className="form-input"
                />

                <select id="category" value={formData.category} onChange={handleChange} required className="input">
                  <option value="">Select Category</option>
                  <option value="electronics">Electronics</option>
                  <option value="textiles">Textiles</option>
                  <option value="machinery">Machinery</option>
                  <option value="automotive">Automotive</option>
                  <option value="consumer-goods">Consumer Goods</option>
                  <option value="pharmaceuticals">Pharmaceuticals</option>
                </select>

                <input
                  type="text"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                  className="form-input"
                />

                <input
                  type="number"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight (kg)"
                  className="form-input"
                />

                <input
                  type="text"
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={handleChange}
                  placeholder="Dimensions"
                  className="form-input"
                />

                <input
                  type="number"
                  id="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="Declared Value (USD)"
                  className="form-input"
                />

                {user?.role === 'admin'? (
                <select
                  type="text"
                  id="origin_location_id"
                  value={formData.origin_location_id}
                  onChange={handleChange}
                  placeholder="Origin Country"
                  className="form-input"
                >
                <option value="">Select Origin Location</option>
                {Array.isArray(location) &&
                  location.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
              </select>
                ):(
                  <input
                  type="text"
                  id="origin_location_id"
                  value={user?.location?.name || formData.origin_location_id}
                  onChange={handleChange}
                  placeholder="Origin Country"
                  className="form-input"
                  disabled
                />
                )}

                <input
                  type="text"
                  id="destination_location_id"
                  value={formData.destination_location_id}
                  onChange={handleChange}
                  placeholder="destination_location_id"
                  className="form-input"
                />

                <select id="transport_id" value={formData.transport_id} onChange={handleChange} className="form-input">
                  <option value="">Select Mode</option>
                  <option value="sea">Sea Freight</option>
                  <option value="air">Air Freight</option>
                  <option value="land">Land Transport</option>
                </select>

                <select id="packaging" value={formData.packaging} onChange={handleChange} className="form-input">
                  <option value="">Select Packaging</option>
                  <option value="container-20ft">20ft Container</option>
                  <option value="container-40ft">40ft Container</option>
                  <option value="cartons">Cartons</option>
                  <option value="pallets">Pallets</option>
                  <option value="crates">Crates</option>
                </select>
              </div>

              <textarea
                id="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder="Special Instructions"
                className="input w-full"
                rows="3"
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={clearForm}>
                  Clear
                </Button>
                <Button type="submit">{selectedCargo ? "Update Cargo" : "Save Cargo"}</Button>
              </div>
            </form> */}
          </CardContent>
          </Card>
        </div>
    )}

      {/* Cargo List */}
      <Card>
        <CardHeader>
          <CardTitle>Cargo List</CardTitle>
        </CardHeader>
        <CardContent>
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Weight/CBM</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Transport Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>ETA</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargos.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.tracking_number}</TableCell>
              <TableCell>{c.client?.name || "N/A"}</TableCell>
              <TableCell>{c.cargo_name}</TableCell>
              <TableCell>{c.quantity}</TableCell>
              <TableCell>
                {c.unit_type === "kg"
                  ? `${c.weight_cbm} kg`
                  : `${c.weight_cbm} cbm`
                  // : `${c.length}x${c.width}x${c.height} cm (${(
                  //     (c.length * c.width * c.height) /
                  //     1000
                  //   ).toFixed(2)} cbm)`
                }
              </TableCell>
              <TableCell>{c.origin_location_id?.name}</TableCell>
              <TableCell>{c.destination_location_id?.name}</TableCell>
              <TableCell>{c.transport_id?.name}</TableCell>
              <TableCell>{c.status}</TableCell>
              <TableCell>{c.eta ? new Date(c.eta).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleCargoSelect(c)}>
                    Edit
                  </Button>
                  {user?.role === "admin" && (
                    <Button size="sm" variant="destructive" onClick={() => deleteCargo(c.id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

            {/* <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargos.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.cargo_number || c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>
                    {c.transport_id === "air" ? (
                      <Plane className="w-4 h-4 inline mr-1" />
                    ) : c.transport_id === "sea" ? (
                      <Ship className="w-4 h-4 inline mr-1" />
                    ) : (
                      <Truck className="w-4 h-4 inline mr-1" />
                    )}
                    {c.transport_id}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded bg-gray-200">{c.status || "Pending"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleCargoSelect(c)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCargo(c.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> */}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CargoPage;