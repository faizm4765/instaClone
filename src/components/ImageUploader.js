import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import { getStorage, ref } from "firebase/storage";

function ImageUploader(){
    const [caption , setCaption] = useState('');
    const [fileName, setImage] = useState(null);

    const handleChange = (e) =>{
        console.log(e.target.files[0]);
        setImage(e.target.files[0])
    }
    const handleUpload = () =>{
        const storage = getStorage();   
        const storageRef = ref(storage);
        const imagesRef = ref(storageRef, 'images');
        const spaceRef = ref(imagesRef, fileName);
        const uploadTask = spaceRef.put(fileName);
        
        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
                 console.log(progress)
            }
        )
    }
    return(
        <div>
            <input type = "text" placeholder='Enter caption!' value = {caption} onChange = {(e) => setCaption(e.target.value)}></input>
            <input type="file" onChange={handleChange}></input>
            <Button onClick = {handleUpload}>
                Upload
            </Button>   
        </div>
    )
}

export default ImageUploader;