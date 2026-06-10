import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { useAuthStore } from "./store";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7178";
export const HUB_URL = `${API_BASE}/chathub`;

// ---------- Response wrapper types ----------
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// ---------- Auth types ----------
export interface AuthResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// ---------- Contact types ----------
export interface SubmitContactDto {
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  country: string;
  jobTitle: string;
  jobDetails: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  country: string;
  jobTitle: string;
  jobDetails: string;
  isResolved: boolean;
  createdAt: string;
}

// ---------- Dashboard types ----------
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  removedUsers: number;
  totalChats: number;
  totalApiRequests: number;
  activeSessions: number;
  totalBlogs: number;
  totalContacts: number;
  estimatedMonthlyRevenue: number;
  generatedAt: string;
  monthlyData: MonthlyData[];
  planDistribution: PlanDistribution[];
  recentUsers: RecentUser[];
  recentContacts: RecentContact[];
}

export interface MonthlyData {
  month: string;
  users: number;
  chats: number;
  apiRequests: number;
  revenue: number;
}

export interface PlanDistribution {
  plan: string;
  count: number;
}

export interface RecentUser {
  id: number;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
}

export interface RecentContact {
  id: number;
  name: string;
  companyName: string;
  isResolved: boolean;
  createdAt: string;
}

// ---------- User types ----------
export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

// ---------- Blog types ----------
export interface BlogListDto {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  thumbnailUrl: string | null;
  categoryName: string;
  authorName: string;
  isPublished: boolean;
  createdAt: string;
}

export interface BlogDto {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnailUrl: string | null;
  categoryId: number;
  categoryName: string;
  authorName: string;
  authorId: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string | null;
  tags: TagDto[];
}

export interface TagDto {
  id: number;
  name: string;
  slug: string;
}

export interface AIReportDto {
  id: number;
  reportTitle: string;
  reportContent: string;
  createdAt: string;
}

export interface UserUsageDto {
  planName: string;
  used: number;
  limit: number;
  resetDate: string;
  dailyUsage: DailyUsageDto[];
}

export interface DailyUsageDto {
  date: string;
  count: number;
}

// ---------- Chat types ----------
export interface ChatSessionDto {
  id: number;
  title: string;
  createdAt: string;
  messageCount: number;
  updatedAt?: string;
}

export interface ChatMessageDto {
  id: number;
  sessionId: number;
  senderType: "user" | "ai";
  message: string;
  createdAt: string;
}

export interface ChatResponseDto {
  userMessage: ChatMessageDto;
  aiMessage: ChatMessageDto;
}

// ---------- Axios client ----------
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — unwrap data
api.interceptors.response.use(
  (res: AxiosResponse<ApiResponse<unknown>>) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = sessionStorage.getItem("refreshToken");
        const accessToken = sessionStorage.getItem("accessToken");
        if (refreshToken && accessToken) {
          const res = await axios.post<ApiResponse<AuthResponse>>(
            `${API_BASE}/api/auth/refresh-token`,
            { accessToken, refreshToken },
            { withCredentials: true }
          );
          if (res.data.success && res.data.data) {
            // Update the Zustand store to keep tokens, storage, and Next.js middleware cookie in sync
            useAuthStore.getState().updateTokens(res.data.data.accessToken, res.data.data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return api(originalRequest);
          }
        }
        throw new Error("Token refresh failed");
      } catch {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

// ---------- API service functions ----------
export const authApi = {
  login: (dto: LoginDto) =>
    api.post<ApiResponse<AuthResponse>>("/auth/login", dto),
  logout: () => api.post<ApiResponse>("/auth/logout"),
  refreshToken: (dto: { accessToken: string; refreshToken: string }) =>
    api.post<ApiResponse<AuthResponse>>("/auth/refresh-token", dto),
  changePassword: (dto: ChangePasswordDto) =>
    api.post<ApiResponse>("/auth/change-password", dto),
};

export const contactApi = {
  submit: (dto: SubmitContactDto) =>
    api.post<ApiResponse<ContactMessage>>("/contact", dto),
  getAll: () =>
    api.get<ApiResponse<ContactMessage[]>>("/contact/messages"),
  resolve: (id: number) =>
    api.put<ApiResponse<ContactMessage>>(`/contact/${id}/resolve`),
  delete: (id: number) =>
    api.delete<ApiResponse>(`/contact/${id}`),
};

export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>("/dashboard/stats"),
  getUsage: () =>
    api.get<ApiResponse<UserUsageDto>>("/dashboard/usage"),
};

export const chatApi = {
  getSessions: () =>
    api.get<ApiResponse<ChatSessionDto[]>>("/chat/sessions"),
  createSession: (title?: string) =>
    api.post<ApiResponse<ChatSessionDto>>("/chat/session", { title }),
  getMessages: (sessionId: number) =>
    api.get<ApiResponse<ChatMessageDto[]>>(`/chat/messages/${sessionId}`),
  sendMessage: (sessionId: number, message: string) =>
    api.post<ApiResponse<ChatResponseDto>>("/chat/message", { sessionId, message }),
  deleteSession: (sessionId: number) =>
    api.delete<ApiResponse>(`/chat/session/${sessionId}`),
  renameSession: (sessionId: number, title: string) =>
    api.put<ApiResponse>(`/chat/session/${sessionId}/rename`, { title }),
};

export const usersApi = {
  getAll: () => api.get<ApiResponse<UserDto[]>>("/users"),
  getById: (id: number) => api.get<ApiResponse<UserDto>>(`/users/${id}`),
  create: (dto: CreateUserDto) =>
    api.post<ApiResponse<UserDto>>("/users", dto),
  update: (id: number, dto: Partial<UserDto>) =>
    api.put<ApiResponse<UserDto>>(`/users/${id}`, dto),
  delete: (id: number) => api.delete<ApiResponse>(`/users/${id}`),
  toggleStatus: (id: number, isActive: boolean) =>
    api.patch<ApiResponse>(`/users/${id}/status`, { isActive }),
};

export const blogsApi = {
  getAll: (params?: { search?: string; category?: string; page?: number; pageSize?: number }) =>
    api.get<ApiResponse<BlogListDto[]>>("/blogs", { params }),
  getBySlug: (slug: string) =>
    api.get<ApiResponse<BlogDto>>(`/blogs/${slug}`),
  create: (dto: { title: string; content: string; thumbnailUrl?: string; categoryId: number; tagIds?: number[] }) =>
    api.post<ApiResponse<BlogDto>>("/blogs", dto),
  update: (id: number, dto: Partial<{ title: string; content: string; thumbnailUrl: string; categoryId: number; isPublished: boolean; tagIds: number[] }>) =>
    api.put<ApiResponse<BlogDto>>(`/blogs/${id}`, dto),
  delete: (id: number) => api.delete<ApiResponse>(`/blogs/${id}`),
};

export const reportsApi = {
  generate: (reportTitle: string) =>
    api.post<ApiResponse<AIReportDto>>("/reports/generate", { reportTitle }),
  getAll: () => api.get<ApiResponse<AIReportDto[]>>("/reports"),
};

export const reviewsApi = {
  getAll: () => api.get<ApiResponse<unknown[]>>("/reviews"),
  getApproved: () => api.get<ApiResponse<unknown[]>>("/reviews/approved"),
  create: (dto: { authorName: string; companyName?: string; content: string; rating: number }) =>
    api.post<ApiResponse<unknown>>("/reviews", dto),
  approve: (id: number) => api.patch<ApiResponse<unknown>>(`/reviews/${id}/approve`),
  delete: (id: number) => api.delete<ApiResponse>(`/reviews/${id}`),
};

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<{ url: string }>>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const pricingApi = {
  getAll: () => api.get<ApiResponse<unknown[]>>("/pricing"),
};

export default api;
