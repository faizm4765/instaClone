import React, { useEffect, useState } from 'react';
import './Posts.css'
import { db }  from '../fire';
import { Avatar, Button } from '@mui/material';
import { arrayRemove, collection, getDocs, onSnapshot, doc, query, QuerySnapshot, collectionGroup, where } from "firebase/firestore";

function Posts(props) {
    const {postId, userName, caption, imageUrl} = props;
    // console.log(imageUrl);
    const [comments, setComments] = useState([]);
    useEffect(
       async  () =>{
            let cleanUp;
            if(postId){
                setComments([]);
                const comments = [];
                const subColRef = collection(db, "posts", postId, "comments");
                const qSnap = getDocs(subColRef).then((doc) => {
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
       },
        [postId]);
        // {
                        
        //     comments.length ? (comments.map((comment) =>{
        //         console.log(comment.userName, comment.comment);
        //     })):(
        //         <></>
        //     )
        // }
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
                    comments && comments.map((comment) =>{
                      return(
                        <p>
                            <strong>{comment.userName}</strong> {comment.comment}
                        </p>
                      )
                    })
                   
                }
            </div>
            <div className='post_comment'>
                <input type='text' placeholder='Add a comment' className='comment_text'/>
                <button type='submit'  className='comment_button'>Post</button>
            </div>
        </div>
    );
}

export default Posts;