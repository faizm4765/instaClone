import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "./App.css";
import Posts from './components/Posts';
import ImageUploader from './components/ImageUploader';
import { db }  from './fire';
import { getAuth, createUserWithEmailAndPassword,  onAuthStateChanged, updateProfile, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { arrayRemove, collection, getDocs, onSnapshot, doc, query, QuerySnapshot } from "firebase/firestore";

//style for modal box
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);  
  const [userName,setUserName] = useState();
  const [email,setEmail] = useState();
  const [password,setPassword] = useState();
  const [user,setuser] = useState(null);

  useEffect( () =>{
    const auth = getAuth();
    const cleanUp = onAuthStateChanged(auth , (authUser) =>{
      if(authUser){
          console.log(authUser)
          setuser(authUser)
          if(authUser.displayName){

          }
          else{
            updateProfile(auth.currentUser,{
                displayName: userName
              }).then(res => console.log(res))
              .catch(err => console.log(err))
          }
      }
      else{
        setuser(null)
      }
    })
    return () =>{
      cleanUp()
    }
  }
  ,[user, userName])

  useEffect(async() =>{
   
    const querySnapshot = await getDocs(collection(db, "posts"));      //fetch data once from firestore (it works)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        // arr.push(doc.data())
      })

    const q = query(collection(db, "posts"))
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //   const cities = [];
    //   querySnapshot.forEach((doc) => {
    //       console.log(doc.data());
    //       cities.push(doc.data());
    //   });
    //   setPosts(cities);
    // });
    
    // This below code works fine-----------------
    const unSub = onSnapshot(q, (querySnapshot) =>{           // fetch data from firestore in realtime
        setPosts([]); 
        querySnapshot.docs.forEach(doc => {         // returning object inside map( ) function
        setPosts((prev) => [...prev,doc.data()])
        console.log(doc.data());
      })
    })
    }
  ,[])  

  const signUp = (event) =>{
    event.preventDefault();
    // console.log(userName,email,password); 
    console.log("SignedUp!!");
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
    setOpen(false);
  }

  const signIn = (event) =>{
    event.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) =>{
    //  alert("Successfully Signed In!")
    })
    .catch((err) => alert("Invalid credntials!"))
    setOpenSignIn(false);
  }

  const logOut = () =>{
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log("SIgnOut Error", error);
    });
  }

  return (
    <div className="app">
      <div className = "app-header">
        <img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="instagram" className="app-header-img"></img>
      </div> 
      <ImageUploader/>
      {
        user ? 
      <Button onClick={() => logOut()}>SignOut</Button>   
        :(
          <div>
              <Button onClick={() => {setOpenSignIn(true)}}>SignIn</Button>   
              <Button onClick={() => {setOpen(true)}}>SignUp</Button>   
          </div>
      )} 

      <Modal
        open={openSignIn}
        onClose={() => {setOpenSignIn(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="modal-form">
          <center>
            <img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="instagram" className="app-header-img-signUp"></img>
          </center>
          <div style={{display:"flex", flexDirection:"column"}}>
            
            <TextField
             required
             id="email"
             label="Email"
             type="email"
             value = {email}
             onChange = {(e) => setEmail(e.target.value)}

            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
        </div>
        <Button type ="submit" onClick = {signIn}>LogIn</Button>
        </form>
        </Box>
      </Modal>


      <Modal
        open={open}
        onClose={() => {setOpen(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form className="modal-form">
          <center>
            <img src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="instagram" className="app-header-img-signUp"></img>
          </center>
          <div style={{display:"flex", flexDirection:"column"}}>
            <TextField
              required
              id="username"
              label="UserName"
              value = {userName}
              onChange = {(e) => setUserName(e.target.value)}
            />
            <TextField
             required
             id="email"
             label="Email"
             type="email"
             value = {email}
             onChange = {(e) => setEmail(e.target.value)}

            />
            <TextField
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
            />
        </div>
        <Button type ="submit" onClick = {signUp}>SignUp</Button>
        </form>
        </Box>
      </Modal>

      {
        posts && posts.length > 0 && posts.map((post,index) =>{
          return <Posts key = {index} userName = {post.userName} caption = {post.caption} imageUrl = {post.imageUrl}/>
        })
      }
     
    </div>
  );
}

export default App;
