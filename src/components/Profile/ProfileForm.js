import { useRef, useContext } from 'react';
import classes from './ProfileForm.module.css';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext)
  const idToken = authCtx.token;
  const history = useHistory();
  const handleSubmit = async(event)=>{
    event.preventDefault();
    const password = newPasswordInputRef.current.value;

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_FIREBASE_KEY}`,{
      method:'POST',
      body: JSON.stringify({
        idToken,
        password,
        returnSecureToken : false
      }),
      headers: {
        'Content-type':'application/json',
        //'Authorization': 'Bearer token'
      }
    })
    if(!response.ok){
      console.log('failed')
      //const data = await response.json();
    }else{
      console.log('Password Changed successful')
      history.replace('/')
    }
  }
  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordInputRef} minLength="7"/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
