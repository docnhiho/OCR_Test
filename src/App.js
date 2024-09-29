import './App.css';
import './css/popup.css';
import React, { useEffect, useState } from 'react';
import useWebcam from './js/common/useWebcam';
import OcrResult from './js/ocr';


function App() {
  const { videoRef, hasPermission, takeSnapshot } = useWebcam();
  const [showPopup, setShowPopup] = useState(false);
  const [capturedImages, setCapturedImages] = useState({ front: null, back: null }); // Lưu mặt trước và mặt sau của CCCD
  const [isFront, setIsFront] = useState(true); // Biến để xác định đang chụp mặt trước hay mặt sau
  const [imageBase64, setImageBase64] = useState({ front: "", back: "" }); // Lưu mã Base64 cho cả hai ảnh

  const takePicture = () => {
    const image = takeSnapshot();
    if (image) {
      const base64String = image.replace("data:image/png;base64,", ""); 


      if (isFront) {
        setCapturedImages(prevState => ({ ...prevState, front: image }));
        setImageBase64(prevState => ({ ...prevState, front: base64String }));
        setIsFront(false); 
      } else {
        setCapturedImages(prevState => ({ ...prevState, back: image }));
        setImageBase64(prevState => ({ ...prevState, back: base64String }));
        setShowPopup(true); 
      }

    }


  };
  // useEffect(() => {
  //   console.log("Mặt trước (Base64):", imageBase64.front);
  //   console.log("Mặt sau (Base64):", imageBase64.back);

  // }, [imageBase64]);


  const closePopup = () => {
    setShowPopup(false);
    setCapturedImages({ front: null, back: null });
    setIsFront(true);
  };

  return (
    <div className="App">
      <h1>Hello</h1>
      {hasPermission ? (
        <>
          <div className="video-container">
            <video ref={videoRef} autoPlay playsInline width="800" height="700">
            </video>
            <div className="frame"></div>



          </div>
          <h1>{isFront ? "Take Front Picture" : "Take Back Picture"}</h1>
          <button onClick={takePicture}>
            {isFront ? "Take Front Picture" : "Take Back Picture"}
          </button>
        </>
      ) : (
        <p>Waiting for webcam access...</p>
      )}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Captured Images</h2>
            <div>
              <h3>Front</h3>
              <img src={capturedImages.front} alt="Front of ID card" />
              <h3>Back</h3>
              <img src={capturedImages.back} alt="Back of ID card" />
            </div>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <OcrResult
        imageBase64={imageBase64}
      ></OcrResult>
    </div>

  );
}

export default App;