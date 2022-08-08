import { useState,useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const authContext = useContext(AuthContext)
  const history = useHistory()
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler  = async (event)=>{
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    let url = '';
    setIsLoading(true)
    if(isLogin){
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_KEY}`
    }else{
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`
    }

    const response = await fetch(url,{
      method:'POST',
      body:JSON.stringify({
        email:enteredEmail,
        password: enteredPassword,
        returnSecureToken:true
      }),
      headers: {
        'Content-type':'application/json'
      }
    })
    setIsLoading(false)
    if(response.ok){
      console.log('success')
      const data = await response.json()
      const expirationTime = new Date(
        new Date().getTime() + (data.expiresIn * 1000)
      )
      authContext.login(data.idToken, expirationTime.toISOString())

      history.replace('/')  //replace => user can't go back with the help of back button
    }else{
      //show error message
      console.log('failed')
      const data = await response.json();
      let errorMessage ='Authentication faild';
      if(data && data.error && data.error.message){
        errorMessage = data.error.message;
      };
      alert(errorMessage);
    }

  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' ref={passwordInputRef} id='password' required />
        </div>
        <div className={classes.actions}>
          {!isLoading &&<button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
