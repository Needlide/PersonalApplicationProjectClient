// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import {
//   BehaviorSubject,
//   catchError,
//   filter,
//   take,
//   tap,
//   throwError,
// } from 'rxjs';
// import { LoginRequestDto } from '../../shared/models/user/login-request.dto';
// import { LoginResponseDto } from '../../shared/models/user/login-response.dto';
// import { UserDto } from '../../shared/models/user/user.dto';
// import { RegisterRequestDto } from '../../shared/models/user/register-request.dto';
// import { handleError } from '../../shared/handle-error';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private http = inject(HttpClient);
//   private readonly rootUrl = 'http://localhost:5047';

//   private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
//   public currentUser$ = this.currentUserSubject.asObservable();

//   private isRefreshing = false;
//   private refreshTokenSubject = new BehaviorSubject<any>(null);

//   public get currentUserValue(): UserDto | null {
//     return this.currentUserSubject.value;
//   }

//   constructor() {
//     this.loadInitialUser();
//   }

//   login(credentials: LoginRequestDto) {
//     return this.http
//       .post<LoginResponseDto>(`${this.rootUrl}/api/auth/login`, credentials)
//       .pipe(
//         tap((response) => {
//           this.storeAuthData(response);
//         }),
//         catchError(handleError)
//       );
//   }

//   register(credentials: RegisterRequestDto) {
//     return this.http
//       .post<UserDto>(`${this.rootUrl}/api/auth/register`, credentials)
//       .pipe(catchError(handleError));
//   }

//   logout() {
//     sessionStorage.removeItem('jwt_token');
//     sessionStorage.removeItem('jwt_user');
//     this.currentUserSubject.next(null);
//   }

//   refreshToken() {
//     if (this.isRefreshing) {
//       return this.refreshTokenSubject.pipe(
//         filter((token) => token != null),
//         take(1)
//       );
//     } else {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       const refreshToken = sessionStorage.getItem('refresh_token');

//       if (!refreshToken) {
//         this.isRefreshing = false;
//         return throwError(() => new Error('No refresh token available'));
//       }

//       return this.http
//         .post<LoginResponseDto>(`${this.rootUrl}/api/auth/refresh`, {
//           refreshToken,
//         })
//         .pipe(
//           tap((response) => {
//             this.isRefreshing = false;
//             this.storeAuthData(response);
//             this.refreshTokenSubject.next(response.token);
//           }),
//           catchError(() => {
//             this.isRefreshing = false;
//             this.logout();
//             return throwError(
//               () => new Error('Session expired. Please log in again.')
//             );
//           })
//         );
//     }
//   }

//   private storeAuthData(response: LoginResponseDto) {
//     sessionStorage.setItem('refresh_token', response.refreshToken);
//     sessionStorage.setItem('jwt_token', response.token);
//     sessionStorage.setItem('jwt_user', JSON.stringify(response.user));
//     this.currentUserSubject.next(response.user);
//   }

//   private loadInitialUser() {
//     const userJson = sessionStorage.getItem('jwt_user');
//     if (userJson) {
//       this.currentUserSubject.next(JSON.parse(userJson));
//     }
//   }

//   public getToken(): string | null {
//     return sessionStorage.getItem('jwt_token');
//   }

//   public isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   public getCurrentUserId(): number | null {
//     return this.currentUserSubject.value?.id ?? null;
//   }
// }

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  take,
  tap,
  throwError,
} from 'rxjs';
import { LoginResponseDto } from '../../shared/models/user/login-response.dto';
import { UserStore } from '../store/user.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userStore = inject(UserStore);
  private readonly rootUrl = 'http://localhost:5047';

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<any>(null);

  public getToken(): string | null {
    return sessionStorage.getItem('jwt_token');
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getCurrentUserId(): number | null {
    return this.userStore.userId();
  }

  refreshToken() {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1)
      );
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        this.isRefreshing = false;
        return throwError(() => new Error('No refresh token available'));
      }

      return this.http
        .post<LoginResponseDto>(`${this.rootUrl}/api/auth/refresh`, {
          refreshToken,
        })
        .pipe(
          tap((response) => {
            this.isRefreshing = false;
            this.userStore.updateAuthData(response);
            this.refreshTokenSubject.next(response.token);
          }),
          catchError(() => {
            this.isRefreshing = false;
            this.userStore.logout();
            return throwError(
              () => new Error('Session expired. Please log in again.')
            );
          })
        );
    }
  }
}
