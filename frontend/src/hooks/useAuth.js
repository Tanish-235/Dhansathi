import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  return {
    user,
    isLoaded,
    isAuthenticated: !!user,
    signOut,
    userId: user?.id,
    email: user?.primaryEmailAddress?.emailAddress,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl
  };
};
