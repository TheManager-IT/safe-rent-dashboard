import React, { useState } from 'react';
import axios from 'axios'; // Assurez-vous d'avoir axios installé

const AddCarForm = () => {
    const [carData, setCarData] = useState({
        registrationPlate: '',
        model: '',
        brand: '',
        images: [],
        numberOfCarSeats: 0,
        locationPrice: 0,
        mileage: 0,
        status: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarData({ ...carData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/cars', carData); // Assurez-vous d'avoir une route appropriée dans votre backend pour gérer cela
            console.log(res.data); // Afficher la réponse de l'API en cas de succès
            // Réinitialiser le formulaire après l'envoi réussi
            setCarData({
                registrationPlate: '',
                model: '',
                brand: '',
                images: [],
                numberOfCarSeats: 0,
                locationPrice: 0,
                mileage: 0,
                status: ''
            });
        } catch (error) {
            console.error('Error adding car:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Registration Plate:
                <input
                    type="text"
                    name="registrationPlate"
                    value={carData.registrationPlate}
                    onChange={handleChange}
                />
            </label>
            <label>
                Model:
                <input
                    type="text"
                    name="model"
                    value={carData.model}
                    onChange={handleChange}
                />
            </label>
            <label>
                Brand:
                <input
                    type="text"
                    name="brand"
                    value={carData.brand}
                    onChange={handleChange}
                />
            </label>
            <label>
                Number of Car Seats:
                <input
                    type="number"
                    name="numberOfCarSeats"
                    value={carData.numberOfCarSeats}
                    onChange={handleChange}
                />
            </label>
            <label>
                Location Price:
                <input
                    type="number"
                    name="locationPrice"
                    value={carData.locationPrice}
                    onChange={handleChange}
                />
            </label>
            <label>
                Mileage:
                <input
                    type="number"
                    name="mileage"
                    value={carData.mileage}
                    onChange={handleChange}
                />
            </label>
            <label>
                Status:
                <input
                    type="text"
                    name="status"
                    value={carData.status}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Add Car</button>
        </form>
    );
};

export default AddCarForm;
