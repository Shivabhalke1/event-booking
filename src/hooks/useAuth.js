import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook shortcut for authentication, user session, and role state
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
