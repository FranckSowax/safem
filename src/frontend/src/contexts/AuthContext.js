import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import authService from '../services/authService';

// Créer le contexte d'authentification
const AuthContext = createContext();

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * @returns {Object} Contexte d'authentification
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Fournisseur du contexte d'authentification
 * @param {Object} props - Props du composant
 * @returns {JSX.Element} Fournisseur du contexte
 */
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  
  // États pour l'authentification
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Vérifier l'authentification de l'utilisateur au chargement
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const session = await authService.getCurrentSession();
        if (session && session.session) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données d'inscription
   */
  const register = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.register(userData);
      if (response && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setError(error.message || 'Erreur lors de l\'inscription');
      return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Connexion d'un utilisateur existant
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   */
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      if (response && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setError(error.message || 'Email ou mot de passe incorrect');
      return { success: false, error: error.message || 'Email ou mot de passe incorrect' };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Déconnexion de l'utilisateur
   */
  const logout = async () => {
    setLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
      // Rediriger vers la page d'accueil après la déconnexion
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setError(error.message || 'Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Mise à jour du profil utilisateur
   * @param {Object} userData - Données à mettre à jour
   */
  const updateProfile = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.updateProfile(userData);
      if (response && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError(error.message || 'Erreur lors de la mise à jour du profil');
      return { success: false, error: error.message || 'Erreur lors de la mise à jour du profil' };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} Statut de connexion
   */
  const isAuthenticated = () => {
    return !!user;
  };
  
  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param {string} role - Rôle à vérifier
   * @returns {boolean} Statut du rôle
   */
  const hasRole = (role) => {
    return user && user.user_metadata && user.user_metadata.role === role;
  };
  
  // Valeurs à fournir au contexte
  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    hasRole
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
