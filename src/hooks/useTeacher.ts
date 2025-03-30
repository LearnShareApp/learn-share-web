import { useState, useEffect, useCallback } from "react";
import { apiService, TeacherProfile } from "../utilities/api";
import { useProfileContext } from "../providers/ProfileProvider";

interface UseTeacherOptions {
  teacherId?: string | number;
  skipProfileCheck?: boolean; // Опция для пропуска проверки, является ли пользователь преподавателем
}

export const useTeacher = (options?: UseTeacherOptions) => {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loadingTeacher, setLoading] = useState(true);
  const [errorTeacher, setError] = useState<string | null>(null);

  // Получаем профиль пользователя из контекста
  const { profile, loadingProfile } = useProfileContext();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);

      // Если запрашивается профиль конкретного преподавателя по ID
      if (options?.teacherId) {
        const data = await apiService.getTeacherById(String(options.teacherId));
        setTeacher(data);
        setError(null);
        return;
      }

      // Если пользователь не является преподавателем и не указан параметр skipProfileCheck,
      // не делаем запрос на получение профиля преподавателя
      if (!options?.skipProfileCheck && !profile?.is_teacher) {
        setTeacher(null);
        setError("User is not a teacher");
        setLoading(false);
        return;
      }

      // В противном случае получаем профиль текущего пользователя как преподавателя
      const data = await apiService.getTeacherProfile();
      setTeacher(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      setTeacher(null);
      setError("Failed to fetch teacher profile");
    } finally {
      setLoading(false);
    }
  }, [options?.teacherId, options?.skipProfileCheck, profile?.is_teacher]);

  useEffect(() => {
    // Ждем загрузки профиля пользователя, если не указан конкретный teacherId
    if (!options?.teacherId && loadingProfile) {
      return;
    }

    fetchProfile();
  }, [fetchProfile, loadingProfile, options?.teacherId]);

  return { teacher, loadingTeacher, errorTeacher, refetch: fetchProfile };
};

export default useTeacher;
