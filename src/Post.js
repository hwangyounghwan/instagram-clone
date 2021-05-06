import React, {useEffect} from 'react';
import './Post.css'
import {Avatar} from "@material-ui/core"
import {useState} from "react";
import {db} from './firebase.js'
import firebase from "firebase";

function Post({ postId,username, caption, imageUrl, user}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('')
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp","asc")
                .onSnapshot((snapshot)=>{
                    setComments(snapshot.docs.map((doc)=>doc.data()))
                })
        }
        return () => {
            unsubscribe();
        }
        },[postId]);

    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return(
        <div className='post'>
            <div className="post__header">
            <Avatar
            className="post__avatar"
            alt={username}
            src="/static/images/avatar/1.jpg"/>
            <h3>{username}</h3>
            </div>
            <img className="post__image" src ={imageUrl}></img>
            <h4 className="post__text"><strong>{username}:</strong> {caption}</h4>
            <div className = "post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>
            {user && (

                <form className = "post__commentsBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment.."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment} >등록
                    </button>

                </form>
            )}

        </div>
    )
}

export default Post