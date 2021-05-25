
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) =>{
  console.log(email, password);
    try {
        const result = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            }
        });
        
        if(result.data.status === 'success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
        console.log(result);
         } catch(err) {
             console.log(err);
        showAlert('error', err.response.data.message);
    }
   
}

export const logout = async () => {
   try {
       const res = await axios({
           method: 'GET',
           url: '/api/v1/users/logout', 
       });
       if((res.data.status ='success')) location.reload(true);
    } catch (err) {
       showAlert('error', 'Error logging out! Try again.')
   }
}
