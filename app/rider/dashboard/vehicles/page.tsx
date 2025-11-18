'use client';

import React, { useState } from 'react';
import { Car, Plus, X, Trash2, Edit, Users } from 'lucide-react';
import './Vehicles.css';

interface Vehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
    seats: number;
    isActive: boolean;
}

const VehicleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (vehicle: Omit<Vehicle, 'id' | 'isActive'>) => void;
    vehicle?: Vehicle | null;
}> = ({ isOpen, onClose, onSave, vehicle }) => {
    const [make, setMake] = useState(vehicle?.make || '');
    const [model, setModel] = useState(vehicle?.model || '');
    const [year, setYear] = useState(vehicle?.year || new Date().getFullYear());
    const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate || '');
    const [color, setColor] = useState(vehicle?.color || '');
    const [seats, setSeats] = useState(vehicle?.seats || 4);

    if (!isOpen) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ make, model, year, licensePlate, color, seats });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content vehicle-modal">
                <div className="modal-header">
                    <h3>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group"><label>Make</label><input type="text" value={make} onChange={e => setMake(e.target.value)} placeholder="e.g., Toyota" required /></div>
                        <div className="form-group"><label>Model</label><input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="e.g., Camry" required /></div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group"><label>Year</label><input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} placeholder="e.g., 2022" required /></div>
                        <div className="form-group"><label>Color</label><input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g., Silver" required /></div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group"><label>License Plate</label><input type="text" value={licensePlate} onChange={e => setLicensePlate(e.target.value)} placeholder="e.g., LAG-1234" required /></div>
                        <div className="form-group"><label>Seats</label><input type="number" value={seats} onChange={e => setSeats(parseInt(e.target.value))} placeholder="e.g., 4" min="1" max="8" required /></div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" className="save-btn">{vehicle ? 'Save Changes' : 'Add Vehicle'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        { id: 1, make: 'Toyota', model: 'Camry', year: 2022, licensePlate: 'LAG-123AB', color: 'Silver', seats: 4, isActive: true },
        { id: 2, make: 'Honda', model: 'CR-V', year: 2021, licensePlate: 'APP-456CD', color: 'Black', seats: 6, isActive: false },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id' | 'isActive'>) => {
        if (editingVehicle) {
            setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...editingVehicle, ...vehicleData } : v));
        } else {
            const newVehicle: Vehicle = {
                id: Date.now(),
                ...vehicleData,
                isActive: vehicles.length === 0,
            };
            setVehicles([...vehicles, newVehicle]);
        }
    };
    
    const handleEdit = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        setVehicles(vehicles.filter(v => v.id !== id));
    };

    const handleSetActive = (id: number) => {
        setVehicles(vehicles.map(v => ({...v, isActive: v.id === id })));
    };

    return (
        <div className="vehicles-container">
            <header className="page-header">
                <div>
                    <h1 className="page-title">My Vehicles</h1>
                    <p className="page-subtitle">Manage your registered vehicles for CityRide.</p>
                </div>
                <button className="add-vehicle-btn" onClick={() => { setEditingVehicle(null); setIsModalOpen(true); }}>
                    <Plus size={18} />
                    <span>Add New Vehicle</span>
                </button>
            </header>
            
            {vehicles.length > 0 ? (
                <div className="vehicles-grid">
                    {vehicles.map(vehicle => (
                        <div key={vehicle.id} className={`vehicle-card ${vehicle.isActive ? 'active' : ''}`}>
                            <div className="card-header">
                                <div className="vehicle-icon"><Car size={24} /></div>
                                <div>
                                    <h3 className="vehicle-name">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                                    <p className="license-plate">{vehicle.licensePlate}</p>
                                </div>
                                {vehicle.isActive && <div className="active-badge">Active</div>}
                            </div>
                            <div className="vehicle-details">
                                <span className="detail-item"><strong>Color:</strong> {vehicle.color}</span>
                                <span className="detail-item"><Users size={14} /> {vehicle.seats} Seats</span>
                            </div>
                            <div className="card-footer">
                                <div className="actions">
                                    <button onClick={() => handleEdit(vehicle)} className="action-btn edit-btn"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(vehicle.id)} className="action-btn delete-btn"><Trash2 size={16} /></button>
                                </div>
                                <button onClick={() => handleSetActive(vehicle.id)} disabled={vehicle.isActive} className="set-active-btn">
                                    {vehicle.isActive ? 'In Use' : 'Set as Active'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Car size={48} />
                    <h3 className="empty-title">No Vehicles Added</h3>
                    <p className="empty-text">Add your vehicle to start receiving ride requests.</p>
                </div>
            )}


             <VehicleModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveVehicle}
                vehicle={editingVehicle}
            />
        </div>
    );
};