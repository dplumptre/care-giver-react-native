import axios from 'axios';

import { urlA,urlI } from '../constant/konst';

export async function createUser({fullName,username,email,password}){
   const response = await axios.post(`${urlA}/auth/signup}`,
        {
            name:fullName,
            username:username,
            email:email,
            password:password,
        }
    );
    return response;
}


export async function signinUser({email,password}){
    const response = await axios.post(`${urlA}/auth/signin`,
         {
             email:email,
             password:password,
         }
     );
     return response;
 }