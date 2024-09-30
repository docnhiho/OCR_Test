import React, { useState } from 'react';

const OcrResult = ({ imageBase64 }) => {
    // console.log("ORC front Images: " + imageBase64.front)
    // console.log("ORC back Images: " + imageBase64.back)
    const [responseData, setResponseData] = useState(null);


    const callApi = async () => {
        const url = '/moldova/ocr';

        const octTest = {
            country: 'MDA',
            img1: imageBase64.frontID,
            img2: imageBase64.backID
        };

        try {
            const response = await fetch(url, {
                mode: 'no-cors',

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Request-Headers": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },

                body: JSON.stringify(octTest), 
            });

            const data = await response.json();
            setResponseData(data);
            console.log('API Response:', data);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    return (
        <div>
            <h1>Call OCR API</h1>
            <button onClick={callApi}>Call API</button>
            {responseData && <pre>{JSON.stringify(responseData, null, 2)}</pre>}
        </div>
    );
};

export default OcrResult;