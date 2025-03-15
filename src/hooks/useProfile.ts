import { useState, useEffect } from "react";
import { apiService, UserProfile } from "../utilities/api";

const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchProfile = async () => {
      try {
        const data = await apiService.getUserProfile();
        if (!isCancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { profile, loadingProfile, error };
};

export default useProfile;
