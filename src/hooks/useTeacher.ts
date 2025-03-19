import { useState, useEffect } from "react";
import { apiService, TeacherProfile } from "../utilities/api";

export const useTeacher = () => {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loadingTeacher, setLoading] = useState(true);
  const [errorTeacher, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTeacherProfile();
      setTeacher(data);
      setError(null);
    } catch {
      setError("Failed to fetch teacher profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { teacher, loadingTeacher, errorTeacher, refetch: fetchProfile };
};

export default useTeacher;
