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

/** Body_create_city */
export interface BodyCreateCity {
  /**
   * Name
   * Название города
   */
  name: string;
  /**
   * Photo
   * Фото города
   * @format binary
   */
  photo: File;
  /**
   * Video
   * Видео города
   * @format binary
   */
  video: File;
}

/** CityCardOut */
export interface CityCardOut {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string | null;
  /** Lat */
  lat: number | null;
  /** Lon */
  lon: number | null;
  /** Image Url */
  image_url: string | null;
  /** Video Url */
  video_url: string | null;
  /** Likes Count */
  likes_count: number;
  /**
   * Is Mine
   * 1, если создатель услуги — текущий пользователь (для гостя всегда 0)
   */
  is_mine: 0 | 1;
}

/** CityFeedOut */
export interface CityFeedOut {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string | null;
  /** Lat */
  lat: number | null;
  /** Lon */
  lon: number | null;
  /** Image Url */
  image_url: string | null;
  /** Video Url */
  video_url: string | null;
  /** Likes Count */
  likes_count: number;
  /**
   * Is Mine
   * 1, если создатель услуги — текущий пользователь (для гостя всегда 0)
   */
  is_mine: 0 | 1;
  /**
   * Liked By Me
   * 1, если текущий пользователь лайкнул услугу (для гостя всегда 0)
   */
  liked_by_me: 0 | 1;
}

/** CityOut */
export interface CityOut {
  /** Id */
  id: number;
  /** Name */
  name: string;
  /** Description */
  description: string | null;
  /** Lat */
  lat: number | null;
  /** Lon */
  lon: number | null;
  /**
   * Status
   * draft | published | deleted
   */
  status: string;
  /** Image Url */
  image_url: string | null;
  /** Video Url */
  video_url: string | null;
}

/** CityPublishIn */
export interface CityPublishIn {
  /**
   * Description
   * Краткое описание города
   * @minLength 1
   * @maxLength 500
   */
  description: string;
  /**
   * Lat
   * Широта, градусы
   * @min -90
   * @max 90
   */
  lat: number;
  /**
   * Lon
   * Долгота, градусы
   * @min -180
   * @max 180
   */
  lon: number;
}

/**
 * ErrorOut
 * Формат ошибки FastAPI: HTTPException(status, detail).
 */
export interface ErrorOut {
  /** Detail */
  detail: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** LikeIn */
export interface LikeIn {
  /**
   * Like
   * 1 — поставить лайк, 0 — снять лайк
   */
  like: 0 | 1;
}

/** LikeOut */
export interface LikeOut {
  /** City Id */
  city_id: number;
  /** Like */
  like: 0 | 1;
  /** Likes Count */
  likes_count: number;
}

/** MessageOut */
export interface MessageOut {
  /** Message */
  message: string;
}

/** UserLoginIn */
export interface UserLoginIn {
  /**
   * Username
   * Логин
   */
  username: string;
  /**
   * Password
   * Пароль
   */
  password: string;
}

/** UserOut */
export interface UserOut {
  /**
   * Id
   * Идентификатор пользователя
   */
  id: number;
  /**
   * Username
   * Логин
   */
  username: string;
}

/** UserRegisterIn */
export interface UserRegisterIn {
  /**
   * Username
   * Логин (уникальный)
   * @minLength 3
   * @maxLength 50
   */
  username: string;
  /**
   * Password
   * Пароль, не длиннее 72 байт
   * @minLength 6
   * @maxLength 72
   */
  password: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
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

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
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

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
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
 * @title ДОРСЕТЬ - Дорожная сеть
 * @version 4.0
 *
 * Веб-сервис «Строительство дорожной сети».
 *
 * **Гость** может только читать данные (список услуг, лента). **Создатель** после `POST /api/users/login` получает сессионную куку и может создавать, публиковать и удалять свои услуги, ставить лайки.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  cities = {
    /**
     * @description Публичный метод. Возвращает опубликованные услуги (города), отсортированные по названию. `lat_max` — широта не больше заданной. Для гостя `is_mine` всегда 0.
     *
     * @tags Услуги (города)
     * @name ListCities
     * @summary Список опубликованных с фильтрацией
     * @request GET:/api/cities
     */
    listCities: (
      query?: {
        /**
         * Lat Max
         * Максимальная широта
         */
        lat_max?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<CityCardOut[], HTTPValidationError>({
        path: `/api/cities`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод создателя. Загружает фото (jpeg/png/webp, до 5 МБ) и видео (mp4/webm, до 50 МБ) в MinIO и создаёт черновик. Создатель (`creator_id`) подставляется автоматически из сессии. У пользователя может быть только один черновик.
     *
     * @tags Услуги (города)
     * @name CreateCity
     * @summary Создание черновика с фото и видео
     * @request POST:/api/cities
     * @secure
     */
    createCity: (data: BodyCreateCity, params: RequestParams = {}) =>
      this.request<CityOut, ErrorOut | HTTPValidationError>({
        path: `/api/cities`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Публичный метод. Возвращает самую недавно опубликованную услугу.
     *
     * @tags Услуги (города)
     * @name FeedFirst
     * @summary Лента без id (самая новая)
     * @request GET:/api/cities/feed
     */
    feedFirst: (params: RequestParams = {}) =>
      this.request<CityFeedOut, ErrorOut>({
        path: `/api/cities/feed`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Публичный метод. Без параметра возвращает услугу с указанным id; с `next=true` — следующую по ленте (опубликованную раньше), после последней — снова самую новую.
     *
     * @tags Услуги (города)
     * @name FeedById
     * @summary Лента по id (?next=true даёт следующую)
     * @request GET:/api/cities/feed/{city_id}
     */
    feedById: (
      cityId: number,
      query?: {
        /**
         * Next
         * Вернуть следующую услугу вместо указанной
         * @default false
         */
        next?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<CityFeedOut, ErrorOut | HTTPValidationError>({
        path: `/api/cities/feed/${cityId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод создателя. Возвращает незавершённый черновик услуги (фото, видео, название).
     *
     * @tags Услуги (города)
     * @name GetDraft
     * @summary Черновик текущего пользователя
     * @request GET:/api/cities/draft
     * @secure
     */
    getDraft: (params: RequestParams = {}) =>
      this.request<CityOut, ErrorOut>({
        path: `/api/cities/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод создателя. Заполняет описание, дорогу и координаты и переводит свой черновик в статус `published`. Гость получает 401, чужая услуга — 403.
     *
     * @tags Услуги (города)
     * @name PublishCity
     * @summary Публикация (draft → published)
     * @request PUT:/api/cities/{city_id}/publish
     * @secure
     */
    publishCity: (cityId: number, data: CityPublishIn, params: RequestParams = {}) =>
      this.request<CityOut, ErrorOut | HTTPValidationError>({
        path: `/api/cities/${cityId}/publish`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Метод создателя. Переводит свою услугу в статус `deleted` (запись остаётся в БД).
     *
     * @tags Услуги (города)
     * @name DeleteCity
     * @summary Мягкое удаление
     * @request DELETE:/api/cities/{city_id}
     * @secure
     */
    deleteCity: (cityId: number, params: RequestParams = {}) =>
      this.request<void, ErrorOut | HTTPValidationError>({
        path: `/api/cities/${cityId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Метод авторизованного пользователя. Лайкать можно только опубликованные услуги; повторный лайк идемпотентен.
     *
     * @tags Услуги (города)
     * @name LikeCity
     * @summary Лайк (1) или отмена лайка (0)
     * @request POST:/api/cities/{city_id}/like
     * @secure
     */
    likeCity: (cityId: number, data: LikeIn, params: RequestParams = {}) =>
      this.request<LikeOut, ErrorOut | HTTPValidationError>({
        path: `/api/cities/${cityId}/like`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создаёт пользователя. Пароль хранится в виде bcrypt-хэша. Доступно гостю.
     *
     * @tags Пользователи
     * @name Register
     * @summary Регистрация
     * @request POST:/api/users
     */
    register: (data: UserRegisterIn, params: RequestParams = {}) =>
      this.request<UserOut, ErrorOut | HTTPValidationError>({
        path: `/api/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Проверяет логин и пароль, создаёт сессию в Redis и устанавливает HttpOnly-куку `session_id`. Дальше браузер (в том числе Swagger) присылает её автоматически; в Insomnia/Postman значение куки копируется вручную.
     *
     * @tags Пользователи
     * @name Login
     * @summary Аутентификация
     * @request POST:/api/users/login
     */
    login: (data: UserLoginIn, params: RequestParams = {}) =>
      this.request<UserOut, ErrorOut | HTTPValidationError>({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет сессию из Redis и стирает куку. Метод авторизованного пользователя.
     *
     * @tags Пользователи
     * @name Logout
     * @summary Деавторизация
     * @request POST:/api/users/logout
     * @secure
     */
    logout: (params: RequestParams = {}) =>
      this.request<MessageOut, ErrorOut>({
        path: `/api/users/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает пользователя по сессии. Нужен фронтенду, чтобы понять, вошёл ли пользователь.
     *
     * @tags Пользователи
     * @name Me
     * @summary Текущий пользователь
     * @request GET:/api/users/me
     * @secure
     */
    me: (params: RequestParams = {}) =>
      this.request<UserOut, ErrorOut>({
        path: `/api/users/me`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
