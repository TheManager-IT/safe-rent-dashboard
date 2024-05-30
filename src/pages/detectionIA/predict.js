import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/predict', formData, {
                responseType: 'blob',
            });
            const imageUrl = URL.createObjectURL(response.data);
            setResultImage(imageUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="App"   style={{ marginLeft:"20%",  }}>
            <h1>Car Detection</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload and Predict</button>
            </form>
            {resultImage && (
                <div>
                    <h2>Result</h2>
                    <img src={resultImage} alt="Extracted Car" />
                </div>
            )}
        </div>
    );
}

export default App;
