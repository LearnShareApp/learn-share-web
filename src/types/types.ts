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
  is_teacher: boolean;
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
  earnings?: number;
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

export interface ComplaintData {
  description: string;
  reason: string;
  reported_id: number;
}

export interface Complaint {
  complainer_avatar: string;
  complainer_email: string;
  complainer_id: number;
  complainer_name: string;
  complainer_surname: string;
  complaint_id: number;
  date: string;
  description: string;
  reason: string;
  reported_avatar: string;
  reported_email: string;
  reported_id: number;
  reported_name: string;
  reported_surname: string;
  status?: "pending" | "resolved" | "rejected";
}

export interface ComplaintResponse {
  complaints: Complaint[];
}

export interface TeachersResponse {
  teachers: TeacherProfile[];
}

export interface AdminTeacher {
  avatar: string;
  name: string;
  surname: string;
  teacher_id: number;
}

export interface AdminTeacherSkill {
  about: string;
  category_id: number;
  rate: number;
  skill_id: number;
  teacher_id: number;
  video_card_link: string;
  is_active: boolean;
  reviews_count: number;
}

export interface GetAdminSkills {
  skills: AdminTeacherSkill[];
  teachers: AdminTeacher[];
}
