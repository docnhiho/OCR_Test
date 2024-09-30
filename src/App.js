import './App.css';
import './scss/popup.scss';
import './scss/index.scss';
import './scss/common.scss';
import React, {useEffect, useState} from 'react';
import useWebcam from './js/common/useWebcam';
import OcrResult from './js/ocr';
import Notification from "./js/common/notification";

function App() {
    const {videoRef, hasPermission, takeSnapshot} = useWebcam();
    const [showPopup, setShowPopup] = useState(false);
    const [capturedImages, setCapturedImages] = useState({frontID: null, backID: null});
    const [isFront, setIsFront] = useState(true);
    const [imageBase64, setImageBase64] = useState({frontID: "", backID: ""});
    const [ocrResult, setOcrResult] = useState();

    const [imageResult,setImageResult] = useState();
    const takePicture = () => {
        const image = takeSnapshot();
        if (image) {
            const base64String = image.replace("data:image/png;base64,", "");

            if (isFront) {
                setCapturedImages(prevState => ({...prevState, frontID: image}));
                setImageBase64(prevState => ({...prevState, frontID: base64String}));
                setIsFront(false);

            } else {
                setCapturedImages(prevState => ({...prevState, backID: image}));
                setImageBase64(prevState => ({...prevState, backID: base64String}));
                setShowPopup(true);
            }
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setCapturedImages({frontID: null, backID: null});
        setIsFront(true);
    };
    const handleOcrComplete = (data) => {
        const JsonData = JSON.parse(data);
        setImageResult(`data:image/png;base64,${JsonData.faceImage}`);
        setOcrResult(JsonData);
    };
    return (
        <div className="ocr">
            <div className="max-width">
                <h1 className="ocr-header">OCR demo</h1>
                {hasPermission ? (
                    <div className="align-center">
                        <div className="ocr-video">
                            <video ref={videoRef} autoPlay playsInline></video>
                            <div className="frame"></div>
                        </div>
                        <button className="btn btn-mainColor" onClick={takePicture}>
                            {isFront ? "Take Front Picture" : "Take Back Picture"}
                        </button>
                        {!isFront && (
                            <Notification type="success" message="Front of ID was taken"></Notification>
                        )}
                    </div>
                ) : (
                    <p>Waiting for webcam access...</p>
                )}

                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Preview</h2>
                            <div>
                                <h3>Front of ID card</h3>
                                <img src={capturedImages.frontID} alt="Front of ID card"/>
                                <h3>Back of ID card</h3>
                                <img src={capturedImages.backID} alt="Back of ID card"/>
                            </div>
                            <div className="btn-group">
                                <button className="margin-right-10 btn btn-mainColor" onClick={closePopup}>Take again
                                </button>
                                <OcrResult
                                    imageBase64={imageBase64}
                                    closePopup={closePopup}
                                    onOcrComplete={handleOcrComplete}
                                ></OcrResult>
                            </div>
                        </div>
                    </div>
                )}
                { ocrResult != null && (
                    <div className="ocr-result">
                        <h3>The result</h3>
                        <img src={imageResult} alt=""/>
                        <p>- The series: {ocrResult["series"]}</p>
                        <p>- The card number: {ocrResult["cardNumber"]}</p>
                        <p>- The ID number: {ocrResult["idNumber"]}</p>
                        <p>- The last name: {ocrResult["lastName"]}</p>
                        <p>- The first name: {ocrResult["firstName"]}</p>
                        <p>- The gender: {ocrResult["gender"]}</p>
                        <p>- The nationality: {ocrResult["nationality"]}</p>
                        <p>- The birthday: {ocrResult["birthday"]}</p>
                        <p>- The issued date: {ocrResult["issuedDate"]}</p>
                        <p>- The expired date: {ocrResult["expiredDate"]}</p>
                        <p>- The issued country: {ocrResult["issuedCountry"]}</p>
                        <p>- The issued authority: {ocrResult["issuedAuthority"]}</p>
                        <p>- The blood type: {ocrResult["bloodType"]}</p>
                        <p>- The residence address: {ocrResult["residenceAddress"]}</p>
                        <p>- The residence registered date: {ocrResult["residenceRegisteredDate"]}</p>
                        <p>- The verification results for card
                            number: {ocrResult["verificationResults"]["cardNumber"]}</p>
                        <p>- The verification results for surname: {ocrResult["verificationResults"]["surname"]}</p>
                        <p>- The verification results for given
                            name: {ocrResult["verificationResults"]["givenName"]}</p>
                        <p>- The verification results for
                            nationality: {ocrResult["verificationResults"]["nationality"]}</p>
                        <p>- The verification results for birthday: {ocrResult["verificationResults"]["birthday"]}</p>
                        <p>- The verification results for
                            expiredDate: {ocrResult["verificationResults"]["expiredDate"]}</p>
                    </div>
                )}

            </div>
        </div>

    );
}

export default App;