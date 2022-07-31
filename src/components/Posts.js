import React, { useEffect, useState } from 'react';
import './Posts.css'
import { db }  from '../fire';
import { Avatar, Button } from '@mui/material';
import { arrayRemove, collection, addDoc, getDocs, onSnapshot, doc, query, QuerySnapshot, collectionGroup, where } from "firebase/firestore";
import { async } from '@firebase/util';
import { serverTimestamp } from "firebase/firestore";
function Posts(props) {
    const {postId, userName, user, caption, imageUrl} = props;
    // console.log(imageUrl);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [flag, setFlag] = useState(false);

    useEffect(
       async  () =>{
        // async function fetchComments(){

        // }
            let qSnap;
            console.log("new changesssssssssssssss!");
            if(postId){
                // console.log("new comment added!");
                // setComments([]);
                const comments = [];
                const subColRef = collection(db, "posts", postId, "comments");
                qSnap = getDocs(subColRef).then((doc) => {
                    setComments(doc.docs.map(docu => docu.data())
                        // console.log(docu.data().comment, docu.id);
                    //    const ob = {
                    //     id: docu.id,
                    //     post: docu.data().comment,
                    //     userName: docu.data().userName
                    //    }
                    //    setComments((prev) => [...prev,ob])
                    )
                } )
                
            }
            return () =>{
                qSnap();
            }
       },
        [postId]);
    
   
        useEffect(
        async  () =>{
                let qSnap;
                console.log("new change!");
              
                // setComments([]);
            //      const updatedComments = [...comments]
            // updatedComments.push(comment)
            // setComments(updatedComments)
                const comments = [];
                const subColRef = collection(db, "posts", postId, "comments");
                qSnap = getDocs(subColRef).then((doc) => {
                    setComments(doc.docs.map(docu => docu.data())




                        // console.log(docu.data().comment, docu.id);
                    //    const ob = {
                    //     id: docu.id,
                    //     post: docu.data().comment,
                    //     userName: docu.data().userName
                    //    }
                    //    setComments((prev) => [...prev,ob])
                    )
                } )
                
                
                return () =>{
                    qSnap();
                }
        },
            [comment]);

    const postComment = async(e) =>{
        e.preventDefault();
        const uploadComment = await addDoc(collection(db, "posts", postId, "comments"),{
            comment: comment,
            userName: user.displayName
        }).then(() =>{
            // const updatedComments = [...comments]
            // updatedComments.push(comment)
            // setComments(updatedComments)
            console.log("comment added")
            setComment('');
            setFlag(true);
            // setComments([]);
            // const comments = [];
            // const subColRef = collection(db, "posts", postId, "comments");
            // qSnap = getDocs(subColRef).then((doc) => {
            //     setComments(doc.docs.map(docu => docu.data())
            //     )})
        })
        .catch(err =>{ 
            // setComment('');
            console.log(err)
        });
        // setComment('');
        // const updatedComments = [...comments]
        // updatedComments.push(comment)
        // setComments(updatedComments)
        // setFlag(true)
    }
    return (
        <div className='post'>
            {/* header -> avatar + username */}
            <div className='post-header'>  
                <Avatar className='post-avatar' alt={userName} src="/static/images/avatar/2.jpg" />
                <h3>{userName}</h3>
            </div>
            {/* post-image */}
            <img src = {imageUrl} className='post-img'></img>
            {/* username + caption */}
            <h3 className='post-text'> <strong> {userName} </strong>{caption} </h3>
            <div className='post_comments'>
                {
                    flag && comments && comments.map((comment) =>{
                      return(
                        <p>
                            <strong>{comment.userName}</strong> {comment.comment}
                        </p>
                      )
                    })        
                }
                 {/* setFlag(false); */}
                {
                   !flag && comments && comments.map((comment) =>{
                      return(
                        <p>
                            <strong>{comment.userName}</strong> {comment.comment}
                        </p>
                      )
                    })
                   
                }
                
            </div>
            { user && (
            <form className='post_comment'>
                <input type='text' placeholder='Add a comment' className='comment_text' value = {comment} onChange={(e) => setComment(e.target.value)}/>
                <button type='submit'  className='comment_button' onClick = {postComment}>Post</button>
            </form> 
            )
            }
        </div>
    );
}

export default Posts;