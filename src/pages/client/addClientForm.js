import React, { useState } from 'react';

function AddClientForm() {
    const [client, setClient] = useState({
        name: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        address: '',
        contractNumber: '',
        drivingLicense: '',
        nationalID: '',
        images: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/v1/api/client/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(client)
            });
            if (!response.ok) throw new Error('Network response was not ok.');
            alert('Client added successfully!');
        } catch (error) {
            alert('Failed to add client: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                value={client.name}
                onChange={handleChange}
                placeholder="Name"
                required
            />
            <input
                name="firstName"
                value={client.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
            />
            <input
                name="email"
                value={client.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <input
                name="phoneNumber"
                value={client.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
            />
            <input
                name="address"
                value={client.address}
                onChange={handleChange}
                placeholder="Address"
                required
            />
            <input
                name="contractNumber"
                value={client.contractNumber}
                onChange={handleChange}
                placeholder="Contract Number"
                required
            />
            <input
                name="drivingLicense"
                value={client.drivingLicense}
                onChange={handleChange}
                placeholder="Driving License"
            />
            <input
                name="nationalID"
                value={client.nationalID}
                onChange={handleChange}
                placeholder="National ID"
                required
            />
            <br/>
            <button type="submit">add Client</button>
        </form>
    );
}

export default AddClientForm;
