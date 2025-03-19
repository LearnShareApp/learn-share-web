import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Получаем URL бекенда из переменной окружения Next.js
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData extends LoginData {
  name: string;
  surname: string;
  birthdate: Date;
}

export interface AddSkillData {
  about: string;
  video_card_link: string;
  category_id: number;
}

export interface AddTimeData {
  datetime: Date;
}

export interface AddReview {
  category_id: number;
  comment: string;
  rate: number;
  teacher_id: number;
}

export interface Review {
  id: number;
  comment: string;
  rate: number;
  user_id: number;
  student_name: string;
  student_surname: string;
  student_avatar: string;
}

export interface ReviewResponse {
  reviews: Review[];
}

export interface LessonRequestData {
  teacher_id: number;
  category_id: number;
  schedule_time_id: number;
}

export interface LoginResponse {
  token: string;
}

export interface Category {
  id: number;
  min_age: number;
  name: string;
}

export interface Skill {
  label: string;
  value: string | null;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface DateTime {
  datetime: Date;
  is_available: boolean;
  schedule_time_id: number;
}

export interface TimesResponse {
  datetimes: DateTime[];
}

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  surname: string;
  birthdate: string;
  avatar: string;
  count_of_teachers: number;
  waiting_lessons: number;
  verification_lessons: number;
  finished_lessons: number;
  registration_date: Date;
}

export interface TeacherSkill {
  about: string;
  category_id: number;
  category_name: string;
  rate: number;
  skill_id: number;
  video_card_link: string;
}

export interface TeacherProfile {
  avatar: string;
  user_id: number;
  teacher_id: number;
  registration_date: Date;
  email: string;
  name: string;
  surname: string;
  birthdate: string;
  finished_lessons: number;
  count_of_students: number;
  common_reviews_count: number;
  common_rate: number;
  skills: TeacherSkill[];
}

export interface TeacherLesson {
  lesson_id: number;
  student_id: number;
  student_name: string;
  student_surname: string;
  student_avatar: string;
  category_id: number;
  category_name: string;
  status: string;
  datetime: Date;
}

export interface Lesson {
  lesson_id: number;
  teacher_id: number;
  teacher_name: string;
  teacher_surname: string;
  teacher_avatar: string;
  category_id: number;
  category_name: string;
  status: string;
  datetime: Date;
}

export interface TeacherLessonResponse {
  lessons: TeacherLesson[];
}

export interface LessonResponse {
  lessons: Lesson[];
}

export interface TeachersResponse {
  teachers: TeacherProfile[];
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Добавляем перехватчик для установки токена авторизации
    this.api.interceptors.request.use((config) => {
      // Используем localStorage для получения токена на стороне клиента
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("userToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });
  }

  // Auth endpoints
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/api/auth/login",
      data
    );
    return response.data;
  }

  async signUp(data: SignUpData): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      "/api/auth/signup",
      data
    );
    return response.data;
  }

  async updateProfile(data: {
    name: string;
    surname: string;
    birthdate: string;
    avatar?: string;
  }): Promise<string> {
    const response = await this.api.patch("/api/user/profile", data);
    return response.statusText;
  }

  async addSkill(data: AddSkillData): Promise<string> {
    const response = await this.api.post("/api/teacher/skill", data);
    return response.statusText;
  }

  async addTime(data: AddTimeData): Promise<string> {
    const response = await this.api.post("/api/teacher/schedule", data);
    return response.statusText;
  }

  async addReview(data: AddReview): Promise<string> {
    const response = await this.api.post("/api/review", data);
    return response.statusText;
  }

  async getTime(): Promise<DateTime[]> {
    const response = await this.api.get<TimesResponse>("/api/teacher/schedule");
    return response.data.datetimes;
  }

  async getTimeById(id: string): Promise<DateTime[]> {
    const response = await this.api.get<TimesResponse>(
      `/api/teachers/${id}/schedule`
    );
    return response.data.datetimes;
  }

  async getAvatar(avatarId: string): Promise<ArrayBuffer> {
    const response = await this.api.get(`/api/image?filename=${avatarId}`, {
      headers: { Accept: "image/*" },
      responseType: "arraybuffer",
    });
    return response.data;
  }

  async lessonRequest(data: LessonRequestData): Promise<string> {
    const response = await this.api.post("/api/lesson", data);
    return response.statusText;
  }

  async lessonApprove(id: number): Promise<string> {
    const response = await this.api.put(`/api/lessons/${id}/approve`);
    return response.statusText;
  }

  async lessonCancel(id: number): Promise<string> {
    const response = await this.api.put(`/api/lessons/${id}/cancel`);
    return response.statusText;
  }

  async lessonFinish(id: number): Promise<string> {
    const response = await this.api.put(`/api/lessons/${id}/finish`);
    return response.statusText;
  }

  async lessonStart(id: number): Promise<string> {
    const response = await this.api.put(`/api/lessons/${id}/start`);
    return response.statusText;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.api.get<CategoriesResponse>("/api/categories");
    return response.data.categories;
  }

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>("/api/user/profile");
    return response.data;
  }

  async getTeacherProfile(): Promise<TeacherProfile> {
    const response = await this.api.get<TeacherProfile>("/api/teacher");
    return response.data;
  }

  async getTeacherLessons(): Promise<TeacherLesson[]> {
    const response = await this.api.get<TeacherLessonResponse>(
      "/api/teacher/lessons"
    );
    return response.data.lessons;
  }

  async getLessons(): Promise<Lesson[]> {
    const response = await this.api.get<LessonResponse>("/api/student/lessons");
    return response.data.lessons;
  }

  async getLessonToken(id: number): Promise<string> {
    const response = await this.api.get<{ token: string }>(
      `/api/lessons/${id}/join`
    );
    return response.data.token;
  }

  async getTeachers(is_mine?: boolean): Promise<TeacherProfile[]> {
    const response = await this.api.get<TeachersResponse>(
      `/api/teachers?${is_mine ? "is_mine=true" : ""}`
    );
    return response.data.teachers || [];
  }

  async getTeacherById(id: string): Promise<TeacherProfile> {
    const response = await this.api.get<TeacherProfile>(`/api/teachers/${id}`);
    return response.data;
  }

  async getTeacherReviews(id: string): Promise<Review[]> {
    const response = await this.api.get<ReviewResponse>(
      `/api/teachers/${id}/reviews`
    );
    return response.data.reviews;
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.api.request<T>(config);
    return response.data;
  }

  async getRoomToken(lessonId: string | number): Promise<{ token: string }> {
    try {
      const response = await this.api.get(`/api/lessons/${lessonId}/join`);

      return { token: response.data.token };
    } catch (error) {
      console.error("Ошибка при получении токена комнаты:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
