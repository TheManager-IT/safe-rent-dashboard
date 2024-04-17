import React, { useState } from 'react';

function AddCarForm() {
  const [car, setCar] = useState({
    registrationPlate: '',
    model: '',
    brand: '',
    images: [],
    numberOfCarSeats: '',
    traveled: {
      mileage: '',
    },
    locationPrice: '',
    status: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCar(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        console.log(e.target.files);
        const imageFile = e.target.files[0];
        setCar(prevState => ({
            ...prevState,
            images: [imageFile]
        }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation des données ici
  
      // Envoi du formulaire
      const formData = new FormData();
      Object.keys(car).forEach(key => {
        if (key === 'images') {
          car.images.forEach(image => {
            formData.append('images', image);
          });
        } else if (key === 'traveled') {
          // Assurez-vous que mileage est converti en un nombre avant de l'ajouter au formulaire
          const mileage = parseFloat(car.traveled.mileage);
          formData.append('traveled.mileage', mileage);
        } else {
          formData.append(key, car[key]);
        }
      });
  
      const response = await fetch('http://localhost:3000/v1/api/voiture/create', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
  
      // Réinitialisation du formulaire après envoi réussi
      setCar({
        registrationPlate: '',
        model: '',
        brand: '',
        images: [],
        numberOfCarSeats: '',
        traveled: {
          mileage: '',
        },
        locationPrice: '',
        status: ''
      });
  
      alert('Car added successfully!');
    } catch (error) {
      setErrorMessage('Failed to add car: ' + error.message);
    }
  };
  

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="registrationPlate"
                value={car.registrationPlate}
                onChange={handleChange}
                placeholder="Registration Plate"
                required
            />
            <input
                name="model"
                value={car.model}
                onChange={handleChange}
                placeholder="Model"
                required
            />
            <input
                name="brand"
                value={car.brand}
                onChange={handleChange}
                placeholder="Brand"
                required
            />
            <input
                name="numberOfCarSeats"
                value={car.numberOfCarSeats}
                onChange={handleChange}
                type="number"
                placeholder="Number of Car Seats"
                required
            />
            <input
                name="locationPrice"
                value={car.locationPrice}
                onChange={handleChange}
                type="number"
                placeholder="Location Price"
            />
            <input
                name="status"
                value={car.status}
                onChange={handleChange}
                placeholder="Status"
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                
            />
            <br/>
            <button type="submit">Add Car</button>
        </form>
    );
}

export default AddCarForm;
