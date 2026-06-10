/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ChangePasswordDto {
  currentPassword?: string | null;
  newPassword?: string | null;
}

export interface CreateBlogDto {
  title?: string | null;
  content?: string | null;
  thumbnailUrl?: string | null;
  /** @format int32 */
  categoryId?: number;
  tagIds?: number[] | null;
}

export interface ForgotPasswordDto {
  email?: string | null;
}

export interface LoginDto {
  email?: string | null;
  password?: string | null;
}

export interface RefreshTokenDto {
  accessToken?: string | null;
  refreshToken?: string | null;
}

export interface ResetPasswordDto {
  email?: string | null;
  token?: string | null;
  newPassword?: string | null;
}

export interface SubmitContactDto {
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  companyName?: string | null;
  country?: string | null;
  jobTitle?: string | null;
  jobDetails?: string | null;
}

export interface ToggleStatusDto {
  isActive?: boolean;
}

export interface UpdateBlogDto {
  title?: string | null;
  content?: string | null;
  thumbnailUrl?: string | null;
  /** @format int32 */
  categoryId?: number | null;
  isPublished?: boolean | null;
  tagIds?: number[] | null;
}

export interface UpdateUserDto {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  isActive?: boolean | null;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title AI Solutions API
 * @version v1
 * @contact Roodles Nepal <contact@aisolutions.com>
 *
 * Production-grade REST API for AI Solutions platform
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/Auth/login
     * @secure
     */
    authLoginCreate: (data: LoginDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthRefreshTokenCreate
     * @request POST:/api/Auth/refresh-token
     * @secure
     */
    authRefreshTokenCreate: (
      data: RefreshTokenDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Auth/refresh-token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthLogoutCreate
     * @request POST:/api/Auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthForgotPasswordCreate
     * @request POST:/api/Auth/forgot-password
     * @secure
     */
    authForgotPasswordCreate: (
      data: ForgotPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Auth/forgot-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthResetPasswordCreate
     * @request POST:/api/Auth/reset-password
     * @secure
     */
    authResetPasswordCreate: (
      data: ResetPasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Auth/reset-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthChangePasswordCreate
     * @request POST:/api/Auth/change-password
     * @secure
     */
    authChangePasswordCreate: (
      data: ChangePasswordDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Auth/change-password`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blogs
     * @name BlogsList
     * @request GET:/api/Blogs
     * @secure
     */
    blogsList: (
      query?: {
        search?: string;
        category?: string;
        /**
         * @format int32
         * @default 1
         */
        page?: number;
        /**
         * @format int32
         * @default 12
         */
        pageSize?: number;
        /** @default false */
        includeUnpublished?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Blogs`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blogs
     * @name BlogsCreate
     * @request POST:/api/Blogs
     * @secure
     */
    blogsCreate: (data: CreateBlogDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Blogs`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blogs
     * @name BlogsDetail
     * @request GET:/api/Blogs/{slug}
     * @secure
     */
    blogsDetail: (slug: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Blogs/${slug}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blogs
     * @name BlogsUpdate
     * @request PUT:/api/Blogs/{id}
     * @secure
     */
    blogsUpdate: (
      id: number,
      data: UpdateBlogDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Blogs/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Blogs
     * @name BlogsDelete
     * @request DELETE:/api/Blogs/{id}
     * @secure
     */
    blogsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Blogs/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact
     * @name ContactCreate
     * @request POST:/api/Contact
     * @secure
     */
    contactCreate: (data: SubmitContactDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Contact`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact
     * @name ContactMessagesList
     * @request GET:/api/Contact/messages
     * @secure
     */
    contactMessagesList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Contact/messages`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact
     * @name ContactResolveUpdate
     * @request PUT:/api/Contact/{id}/resolve
     * @secure
     */
    contactResolveUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Contact/${id}/resolve`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contact
     * @name ContactDelete
     * @request DELETE:/api/Contact/{id}
     * @secure
     */
    contactDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Contact/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersList
     * @request GET:/api/Users
     * @secure
     */
    usersList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Users`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersDetail
     * @request GET:/api/Users/{id}
     * @secure
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Users/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersUpdate
     * @request PUT:/api/Users/{id}
     * @secure
     */
    usersUpdate: (
      id: number,
      data: UpdateUserDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Users/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersDelete
     * @request DELETE:/api/Users/{id}
     * @secure
     */
    usersDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Users/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UsersStatusPartialUpdate
     * @request PATCH:/api/Users/{id}/status
     * @secure
     */
    usersStatusPartialUpdate: (
      id: number,
      data: ToggleStatusDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/Users/${id}/status`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
