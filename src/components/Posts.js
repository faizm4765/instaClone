import React from 'react';
import './Posts.css'
import { Avatar } from '@mui/material';


function Posts(props) {
    const {userName,caption,imageUrl} = props;
    // console.log(props);
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
        </div>
    );
}

export default Posts;