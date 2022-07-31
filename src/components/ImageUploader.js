import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import { storage,db } from '../fire';
import { collection, addDoc } from "firebase/firestore"; 
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "./imageUploader.css";
import { serverTimestamp } from "firebase/firestore";

function ImageUploader({userName}){
    const [caption , setCaption] = useState('');
    const [fileName, setImage] = useState(null);
    const [fileUrl, setImageUrl] = useState(null);
    const [progressPercent, setProgressPercent] = useState(0);

    const handleChange = (e) =>{
        // console.log(e.target.files[0]);
        setImage(e.target.files[0])
    }
    const handleUpload = (e) =>{
        e.preventDefault();
        if(fileName == null)
            return;
        console.log(fileName.name);
        const storageRef = ref(storage, `files/${fileName.name}`)
        const uploadTask = uploadBytesResumable(storageRef, fileName);
        uploadTask.on("state_changed",
            (snapshot) =>{
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgressPercent(progress);
            }, 
            (error) =>{
                alert(error);
            },
            () =>{
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) =>{
                    setImageUrl(downloadUrl);
                    console.log(userName);
                    setProgressPercent(0);
                    const docRef = await addDoc(collection(db, "posts"), {
                        caption: caption,
                        imageUrl: downloadUrl,
                        userName: userName,
                        // created: serverTimestamp
                      });
                }).catch(err => console.log(err));
            } 
        
        )
        setCaption("");
        setImage(null);
        setProgressPercent(0);
    }
    return(
        <div className='imageUploader'>
            {/* {userName} */}
            <input type = "text" placeholder='Enter caption!' value = {caption} onChange = {(e) => setCaption(e.target.value)}></input>
            <input type="file" key={fileName} onChange={handleChange}></input>
            {(progressPercent != 0) ? (
               <progress id="file" value={progressPercent} max="100"> {progressPercent} </progress>
            ): (
                <></>
            )
            }
            <Button onClick = {handleUpload}>
                Upload
            </Button>   
        </div>
    )
}   

export default ImageUploader;