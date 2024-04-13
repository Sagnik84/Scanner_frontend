import React, { useState } from 'react';
import jsQR from 'jsqr';

function QRCodeScanner() {
    const [capturedImage, setCapturedImage] = useState(null);

    // Function to capture an image from the camera and convert it to base64
    const captureImageAndEncodeToBase64= async (e)=> {
       // e.preventDefault();
        return new Promise((resolve, reject) => {
            // Request access to the camera
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(stream => {
                    // Create a video element to display the camera stream
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();

                    // When the video metadata is loaded, create a canvas and draw the video frame on it
                    video.addEventListener('loadedmetadata', () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        // Get the image data from the canvas
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                        // Detect QR code from the image data
                        const code = jsQR(imageData.data, imageData.width, imageData.height);

                        // Stop the camera stream
                        stream.getTracks().forEach(track => track.stop());

                        // Resolve the promise with the base64-encoded data URL
                        resolve(code);
                    });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Event handler for the capture button
    function handleCaptureButtonClick(e) {
        e.preventDefault();
        captureImageAndEncodeToBase64()
        .then(base64Data => {
                    
                    
            const qrcodeData={
                number:base64Data.data
            }
            console.log(qrcodeData);
            const StringConvert=JSON.stringify(qrcodeData)
            console.log(StringConvert)
            // Use the base64-encoded data as needed (e.g., send it to the server)
            fetch('https://mern-web-ldis.onrender.com/scan', { // Update the URL to match your server
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: StringConvert
            })})
            .catch(error => {
                // Handle capture error
                console.error('Capture error:', error);
            });
    }

    return (
        <div>
            <h1>Camera Image to Base64</h1>
            <button onClick={handleCaptureButtonClick}>Capture Image</button>
            <br />
            <img src={capturedImage} alt="Captured Image" />
        </div>
    );
}

export default QRCodeScanner;
