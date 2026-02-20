import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
//import { useDataStore } from '../store/useDataStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { X, Download, Search, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '../components/ui/select';
import "./Clients.css";
import { useClientStore } from '../store/useClientStore';

const Clients = () => {
  const { user } = useAuthStore();  
  // const { 
  //   clients = [], 
  //   fetchClients, 
  //   addClient, 
  //   editClient, 
  //   deleteClient 
  // } = useDataStore();
  const {
    clients,
    locations,
    currentPage,
    totalPages,
    fetchClients,
    fetchFormOptions,
    fetchLocations,
    addClient,
    editClient,
    deleteClient,
    setCurrentPage,
  } = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    location_id: '',
  });
  const [errors, setErrors] = useState({});
  const [rowsPerPage, setRowsPerPage] = useState(10);
 
  useEffect(() => {
    fetchClients();
    if(user?.role === 'admin'){
      fetchLocations();
    }
  }, [fetchLocations, fetchClients, user]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      location_id: '',
    });
    setErrors({});
    setEditingId(null);
  };

  const validateForm = () =>{
    const errors = {};
    if (!formData.name) {
      errors.name = 'Name is required';
      }
    if (!formData.email) {
      errors.email = 'Email is required';
    }
    if (!formData.phone) {
      errors.phone = 'Phone is required';
    }
    if (!formData.gender) {
      errors.gender = 'Gender required';
    }
    if (user?.role === 'admin' && !formData.location_id) {
      errors.location_id = 'Location is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      location_id: user?.role === 'admin' ? Number(formData.location_id): user?.location_id,
    };
    let success = false;

    
    if (isEditingId) {
        success = await editClient(isEditingId, payload); // <- implement this in store if needed
        if (success) toast.success('Client updated successfully');
    } else{
      success = await addClient(payload);
      if (success) toast.success('Client added successfully');
    }
    if (success) {
      await fetchClients();
    setIsModalOpen(false);
    resetForm();
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      gender: client.gender,
      location_id: client.location_id,
    });   
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this client?')) return;
    const success = await deleteClient(id);
    if(success){
      toast.success('Client deleted successfully');
      fetchClients();
    }
  };

  const exportData = () => {
    const csv = 
      'Name,Email,Phone,Gender,Location\n' + 
      filtered.map(c => `${c.name}, ${c.email}, ${c.phone}, ${c.gender}, ${c.location?.name || ''}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = 'clients.csv';
    a.click();
  };

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm)
  );

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  return (
    <div className="clients-container">
      <div className="header-container">
        <h1 className="page-title">Clients</h1>
        <Button variant="outline" onClick={exportData} className="export-button">
          <Download className="download-btn" /> 
          Export Data
        </Button>
      </div>

       {/*Add Client Button*/}
      <div>
        <Button  
          onClick={() => setIsModalOpen(true)}
          className="add-client"
        >
          Add Client
        </Button>
      </div>

      {/*Client list Card*/}
      <div><Card>
        <CardHeader>
          <CardTitle>Registered Clients    ({Array.isArray(clients) ? clients.length : 0})</CardTitle>
          <div className="search-section">
            <div className="entries-selector">
              <span className="show-btn">Show</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={v => {
                  setRowsPerPage(+v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[10, 25, 50, 100].map(n => 
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {/* <Select
                className="select-btn"
                defaultValue={rowsPerPage}
                onChange={(e)=>{
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setCurrentPage(1); // Reset to first page when changing rows per page
                }}
                value={rowsPerPage.toString()} // 👈 Important: controlled value
              >
                {[10, 25, 50, 100].map(n =>(
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))} */}
                {/* <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder= "Select rows"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {[10, 25, 50, 100].map(n =>(
                      <SelectItem key={n} value={n.toString()}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent> 
              </Select>*/}
              <span className="text-sm text-gray-500">entries</span>
            </div>

            <div className="search-container">
              <Search className="search-icon" />
              <Input 
                placeholder="Search Clients..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <table className="clients-table">
              <thead className="table-header">
                <tr>
                  <th className="w-[250px]">Name</th>
                  <th className="w-[250px]">Email</th>
                  <th className="w-[150px]">Phone</th>
                  <th className="w-[75px]">Gender</th>
                  <th className="w-[95px]">Location</th>
                  <th className="w-[25px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(start, end).map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="w-[250px]">{c.name}</td>
                    <td className="table-cell">{c.email}</td>
                    <td className="table-cell">{c.phone}</td>
                    <td className="table-cell">{c.gender}</td>
                    <td className="table-cell">{c.location?.name || ''}</td>
                    <td>
                      <Button variant="ghost" size="sm" onClick={() => { setEditingId(c.id); setFormData(c); setIsModalOpen(true);}}>
                        <Pencil size={14} />
                      </Button>
                      
                      { user?.role === 'admin' && (
                          <Button variant="ghost" size="sm" onClick={() => deleteClient(c.id)}>
                            <Trash2 size={14} />
                          </Button>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filtered.length && (
            <Alert>
              <AlertDescription> No Clients found. Start by adding one.</AlertDescription>
            </Alert>
          )}
          <div className="pagination-container">
            <span>
              Showing {start + 1} to {Math.min(end, filtered.length)} of {filtered.length}{' '} entries 
            </span>
            <div>
              <Button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}> 
                Previous 
              </Button>
              <Button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}> 
                Next 
              </Button>
            </div>
          </div>
        </CardContent>
      </Card></div>
        

      {isModalOpen && (
        <div className="modal-overlay">
          <Card className="modal-container">
            <CardHeader className="modal-header">
              <CardTitle className="modal-title">
                {isEditingId ? 'Edit Client':'Add New Client'}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="modal-close-btn"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="modal-content">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-grid">
                  <div className="form-group">
                    <Input
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
                  </div>
                  <div className="form-group">
                    <Input
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                    />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                  </div>
                  <div className="form-group">
                    <Input
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                    />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}
                  </div>

                  <div className="form-group">
                    <select name="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value})}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {/* <Input
                    //   placeholder="Gender"
                    //   value={formData.gender}
                    //   onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    //   className={`form-input ${errors.gender ? 'error' : ''}`}
                     />*/}
                    {errors.gender && <p className="error-message">{errors.gender}</p>}
                  </div> 
                  
                  {user?.role === 'admin' && (
                    <div className="form-row">
                    <select name="location_id" value={formData.location_id || ""} onChange={(e) => setFormData({ ...formData, location_id: e.target.value})}>
                      <option value="">Select Location</option>
                      {Array.isArray(locations) && locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                    {/* {errors.gender && <p className="error-message">{errors.gender}</p>} */}
                  </div>
                  )}
                </div>

                <div className="modal-footer">
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                    }} className="cancel-btn">
                    Cancel
                  </Button>
                  <Button type="submit" className="add-grw-btn">
                    {isEditingId ? 'Update' : 'Save'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Clients;