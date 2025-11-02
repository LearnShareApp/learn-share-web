import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {
  LoginData,
  SignUpData,
  AddSkillData,
  AddTimeData,
  AddReview,
  Review,
  ReviewResponse,
  LessonRequestData,
  LoginResponse,
  Category,
  CategoriesResponse,
  DateTime,
  TimesResponse,
  UserProfile,
  TeacherProfile,
  TeacherLesson,
  Lesson,
  TeacherLessonResponse,
  LessonResponse,
  ComplaintData,
  Complaint,
  ComplaintResponse,
  TeachersResponse,
  GetAdminSkills,
} from "@/types/types";

// Получаем URL бекенда из переменной окружения Next.js
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // Проверяем наличие URL бекенда
    if (!BACKEND_URL) {
      console.error(
        "NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file."
      );
    }

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
    return response.data.datetimes || [];
  }

  async getTimeById(id: string): Promise<DateTime[]> {
    const response = await this.api.get<TimesResponse>(
      `/api/teachers/${id}/schedule`
    );
    return response.data.datetimes || [];
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
    const response = await this.api.put(`/api/lessons/${id}/plan`);
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
    return response.data.categories || [];
  }

  async getUserProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>("/api/user/profile");
    return response.data;
  }

  async getUserProfileById(id: string | number): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>(
      `/api/users/${id}/profile`
    );
    return response.data;
  }

  async getIsAdmin(): Promise<boolean> {
    const response = await this.api.get<{ is_admin: boolean }>(
      `/api/user/is-admin`
    );
    return response.data.is_admin;
  }

  async getComplaints(): Promise<Complaint[]> {
    const response = await this.api.get<ComplaintResponse>(
      `/api/admin/complaints`
    );
    return response.data.complaints || [];
  }

  async getAdminSkills(): Promise<GetAdminSkills> {
    const response = await this.api.get<GetAdminSkills>(`/api/admin/skills`);
    return response.data;
  }

  async approveTeacherSkill(id: number): Promise<string> {
    const response = await this.api.put<ComplaintResponse>(
      `/api/admin/skills/${id}/approve`
    );
    return response.statusText;
  }

  async sendComplaint(data: ComplaintData): Promise<string> {
    const response = await this.api.post("/api/complaint", data);
    return response.statusText;
  }

  async getTeacherProfile(): Promise<TeacherProfile> {
    const response = await this.api.get<TeacherProfile>("/api/teacher");
    return response.data;
  }

  async getTeacherLessons(): Promise<TeacherLesson[]> {
    const response = await this.api.get<TeacherLessonResponse>(
      "/api/teacher/lessons"
    );
    return response.data.lessons || [];
  }

  async getLessons(): Promise<Lesson[]> {
    const response = await this.api.get<LessonResponse>("/api/student/lessons");
    return response.data.lessons || [];
  }

  async getLessonToken(id: number): Promise<string> {
    const response = await this.api.get<{ token: string }>(
      `/api/lessons/${id}/join`
    );
    return response.data.token;
  }

  async getTeachers(params?: {
    is_mine?: boolean;
    category?: string;
  }): Promise<TeacherProfile[]> {
    const queryParams = new URLSearchParams();
    if (params?.is_mine) {
      queryParams.append("is_mine", "true");
    }
    if (params?.category && params.category !== "") {
      queryParams.append("category", params.category);
    }

    const response = await this.api.get<TeachersResponse>(
      `/api/teachers?${queryParams.toString()}`
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
      console.error("Error getting room token:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
