
import { useEffect, useContext } from 'react';

import { authContext } from '../../store/auth-context';

const LogoutScreen = () => {
  const authCtx = useContext(authContext);

  useEffect(() => {
    authCtx.logout(); 
  }, []);

  return null;
};

export default LogoutScreen;
