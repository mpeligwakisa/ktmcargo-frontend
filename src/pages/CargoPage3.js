import React, { useState, useEffect } from 'react';
import './CargoPage.css';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Upload, Plane, Ship, FileText } from 'lucide-react';

const CargoPage = () => {
  const [cargos, setCargos] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [uploadFile, setUploadFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCargos();
  }, [searchTerm, filter]);

  const fetchCargos = async () => {
    try {
      const res = await fetch(`/api/cargo?search=${searchTerm}&filter=${filter}`);
      const data = await res.json();
      setCargos(data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error fetching cargo data' });
    }
  };

  const fetchDocuments = async (cargoId) => {
    try {
      const res = await fetch(`/api/cargo/${cargoId}/documents`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setAlert({ type: 'error', message: 'Error fetching documents' });
    }
  };

  const handleCargoSelect = (cargo) => {
    setSelectedCargo(cargo);
    fetchDocuments(cargo.id);
  };

  const handleUpload = async () => {
    if (!uploadFile || !documentType) {
      setAlert({ type: 'error', message: 'Please select a file and document type' });
      return;
    }

    const formData = new FormData();
    formData.append('document', uploadFile);
    formData.append('documentType', documentType);

    try {
      const res = await fetch(`/api/cargo/${selectedCargo.id}/documents`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchDocuments(selectedCargo.id);
        setUploadFile(null);
        setDocumentType('');
        setAlert({ type: 'success', message: 'Document uploaded successfully' });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Error uploading document' });
    }
  };

  return (
    <div className="cm-wrap">
      {alert && (
        <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="cm-top">
        <Input
          type="text"
          placeholder="Search cargo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cm-input"
        />
        <Select value={filter} onValueChange={setFilter} className="cm-select">
          <option value="all">All Cargo</option>
          <option value="air">Air</option>
          <option value="sea">Sea</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cargo List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cargos.map((c) => (
                <TableRow key={c.id} className={selectedCargo?.id === c.id ? 'cm-row-active' : ''}>
                  <TableCell>{c.cargo_number}</TableCell>
                  <TableCell>{c.client_name}</TableCell>
                  <TableCell>
                    <div className="cm-flex">
                      {c.transport_mode === 'AIR' ? <Plane className="cm-icon" /> : <Ship className="cm-icon" />}
                      {c.transport_mode === 'AIR' ? 'Air' : 'Sea'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`cm-status ${c.status}`}>{c.status}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`cm-pay ${c.payment_status}`}>{c.payment_status}</span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleCargoSelect(c)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCargo && (
        <div className="cm-grid">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="cm-box">
              <div>
                <label>Cargo #</label>
                <p className="cm-mono">{selectedCargo.cargo_number}</p>
              </div>
              <div>
                <label>Tracking #</label>
                <p className="cm-mono">{selectedCargo.tracking_number}</p>
              </div>
              <div>
                <label>Client</label>
                <p>{selectedCargo.client_name}</p>
              </div>
              <div className="cm-subgrid">
                <div>
                  <label>Mode</label>
                  <p className="cm-flex">
                    {selectedCargo.transport_mode === 'AIR' ? <><Plane className="cm-icon" /> Air</> : <><Ship className="cm-icon" /> Sea</>}
                  </p>
                </div>
                <div>
                  <label>Measurement</label>
                  <p>{selectedCargo.measurement_value} {selectedCargo.measurement_type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent className="cm-box">
              <div className="cm-upload">
                <Input type="file" onChange={(e) => setUploadFile(e.target.files[0])} accept=".pdf,.doc,.jpg,.png" />
                <Select value={documentType} onValueChange={setDocumentType}>
                  <option value="invoice">Invoice</option>
                  <option value="bill_of_lading">BOL</option>
                  <option value="packing_list">Packing List</option>
                  <option value="certificate">Certificate</option>
                  <option value="other">Other</option>
                </Select>
                <Button onClick={handleUpload} className="cm-btn">
                  <Upload className="cm-icon" />
                  Upload
                </Button>
              </div>

              <div className="cm-docs">
                <h4>Uploaded</h4>
                {documents.length === 0 ? (
                  <p className="cm-empty">No documents</p>
                ) : (
                  documents.map((doc) => (
                    <div key={doc.id} className="cm-doc-row">
                      <div className="cm-flex">
                        <FileText className="cm-icon" />
                        <span>{doc.document_type}</span>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CargoPage;
