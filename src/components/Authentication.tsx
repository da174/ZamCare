// src/components/Authentication.tsx
import  { useState, useEffect } from 'react';
import { account } from '../AppwriteService'; 
import { Session } from '../types'; 

const Authentication: React.FC = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [userSession, setUserSession] = useState<Session | null>(null); 

     useEffect(() => {
          const fetchSession = async () => {
               try {
                    const session = await account.getSession('current');
                    setUserSession(session);
               } catch (error) {
                    console.error('No active session:', error);
               }
          };

          fetchSession();
     }, []);

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault();
          if (userSession) {
               await handleLogout(); 
          }

          try {
               await account.createSession(email, password);
              
          } catch (error) {
               console.error('Error logging in:', error);
          }
     };

     const handleLogout = async () => {
          try {
               await account.deleteSession('current'); 
               setUserSession(null); 
          } catch (error) {
               console.error('Error logging out:', error);
          }
     };

     return (
          <div>
               {userSession ? (
                    <button onClick={handleLogout}>Logout</button>
               ) : (
                    <form onSubmit={handleLogin}>
                         <input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                         />
                         <input
                              type="password"
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                         />
                         <button type="submit">Login</button>
                    </form>
               )}
          </div>
     );
};

export default Authentication;
