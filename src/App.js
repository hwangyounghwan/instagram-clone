import './App.css';
import Post from './Post'
import React, {useState, useEffect} from "react"
import {db, auth} from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import {Button, Input} from "@material-ui/core";
import ImgUpload from "./imageUpload.js"
import InstagramEmbed from 'react-instagram-embed'


function App() {
    const [posts,setPosts] = useState([]);
    const [openSignIn, setOpenSignIn] = useState('');
    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [user,setUser] = useState(null);
    const [openUpload, setOpenUpload] = useState('');


    function getModalStyle() {
        const top = 50;
        const left = 50;

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
        };
    }

    const useStyles = makeStyles((theme) => ({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
        },
    }));
    const classes = useStyles();

    const signUp = (event) =>{
        event.preventDefault()

        auth.createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
           return authUser.user.updateProfile({
               displayName: username
           })
        })
        .catch((error)=> alert(error.message))
    }

    useEffect(() =>{
       const unsubscribe = auth.onAuthStateChanged((authUser)=>{
           if(authUser) {
            //유저가 로그인을 이미 한경우
            console.log(authUser);
            setUser(authUser);
            if(authUser.displayName){
                // don't update username

            }else{
                //if we just create someone
                return authUser.updateProfile({
                    displayName: username,
                })
            }
           }else{
            // 유저가 로그아웃을 한경우
               setUser(null);
           }
       })

        return () => {
           //perform some cleanup action
            unsubscribe();
        }
    },[user, username])

    useEffect(() => {
        // this is where the code runs
        db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()

            })));
        })
        //every time a new post is added, this code fired
    } ,[])

    const signIn = (event) => {
        event.preventDefault()

        auth
            .signInWithEmailAndPassword(email,password)
            .catch((error)=> {
                alert(error);
            })

        setOpenSignIn(false);
    }


  return (
      <div className="App">

          <Modal
              open={open}
              onClose={()=> {setOpen(false)}}>
              <div style={modalStyle} className={classes.paper}>
                  <form className = "app__signup">

                    <img
                        className= "app__signup"
                        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                        alt={"mainlogo"}
                    />
                    <Input placeholder="username"
                           type={"text"}
                           value={username}
                           onChange={(e)=>{setUsername(e.target.value)}}
                    />
                    <Input placeholder="email"
                           type={"text"}
                           value={email}
                           onChange={(e)=>{setEmail(e.target.value)}}
                    />
                    <Input placeholder="password"
                           type={"password"}
                           value={password}
                           onChange={(e)=>{setPassword(e.target.value)}}
                    />
                    <Button type ="submit" onClick={signUp}>Sign Up</Button>

                      </form>
              </div>
          </Modal>

          <Modal
              open={openSignIn}
              onClose={()=> {setOpenSignIn(false)}}>
              <div style={modalStyle} className={classes.paper}>
                  <form className = "app__signup">

                      <img
                          className= "app__signup"
                          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                          alt={"mainlogo"}
                      />

                      <Input placeholder="email"
                             type={"text"}
                             value={email}
                             onChange={(e)=>{setEmail(e.target.value)}}
                      />
                      <Input placeholder="password"
                             type={"password"}
                             value={password}
                             onChange={(e)=>{setPassword(e.target.value)}}
                      />
                      <Button type ="submit" onClick={signIn}>Sign In</Button>

                  </form>
              </div>
          </Modal>


          <Modal
              open={openUpload}
              onClose={()=> {setOpenUpload(false)}}>
              <div style={modalStyle} className={classes.paper}>
                  {user?.displayName ? (<ImgUpload username = {user.displayName} setOpenUpload = {setOpenUpload}/>) : <h3>
                  </h3>}
              </div>
          </Modal>


        <div className= "app__header">
          <img
              className= "app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt={"mainlogo"}
          />

          { user? (
                  <div className = "app__userContainer">
                    <Button onClick={() => {auth.signOut()}}>Logout</Button>
                    <Button onClick ={() =>{setOpenUpload(true)}}>Upload</Button>
                  </div>
          ) :
              (<div className = "app__loginContainer">
                      <Button onClick={() => {setOpenSignIn(true)}}>Login</Button>
                      <Button onClick={() => {setOpen(true)}}>Sign Up</Button>
              </div>
              )}
        </div>
        <div className={"app__posts"}>
            <div className = 'app__postsLeft'>
          {
              posts.map(({id,post}) => (
                <Post key={id} postId ={id} user = {user} username={post.username} caption={post.caption} imageUrl={post.imgUrl}/>
              ))
          }
            </div>
        </div>

      </div>
  );
}

export default App;
