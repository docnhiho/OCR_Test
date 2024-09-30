import React, { useState } from 'react';
import LoadingEffect from "./common/loadingEffect";
const OcrResult = ({ imageBase64, closePopup, onOcrComplete }) => {
    const [loading, setLoading] = useState(true);
    const callApi = async () => {
        const url = '/moldova/ocr';

        const ocrTest = {
            country: 'MDA',
            img1: imageBase64.frontID,
            img2: imageBase64.backID
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Request-Headers": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                },
                body: JSON.stringify(ocrTest),
            });

            const data = await response.json();
            const result = JSON.stringify(data, null, 2);

            console.log(result);
            onOcrComplete(result);
            setLoading(false);
            closePopup();
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };

    return (
        <div>
            {loading && (<LoadingEffect></LoadingEffect>)}
            <button className="btn btn-mainColor" onClick={callApi}>submit</button>
        </div>
    );
};

export default OcrResult;