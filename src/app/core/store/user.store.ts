import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { UserDto } from '../../shared/models/user/user.dto';
import { LoginRequestDto } from '../../shared/models/user/login-request.dto';
import { RegisterRequestDto } from '../../shared/models/user/register-request.dto';
import { HttpClient } from '@angular/common/http';
import { LoginResponseDto } from '../../shared/models/user/login-response.dto';
import { Router } from '@angular/router';

interface UserState {
  currentUser: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ currentUser }) => ({
    userFullName: computed(() => {
      const user = currentUser();
      return user ? `${user.firstName} ${user.lastName}` : '';
    }),
    userInitials: computed(() => {
      const user = currentUser();
      return user ? `${user.firstName[0]}${user.lastName[0]}` : '';
    }),
    userId: computed(() => currentUser()?.id ?? null),
    userEmail: computed(() => currentUser()?.email ?? ''),
  })),
  withMethods((store, http = inject(HttpClient), router = inject(Router)) => {
    const rootUrl = 'http://localhost:5047';

    return {
      // Set user initially
      setUser(user: UserDto | null) {
        patchState(store, {
          currentUser: user,
          isAuthenticated: !!user,
          error: null,
        });
      },

      // Is app loading
      setLoading(isLoading: boolean) {
        patchState(store, { isLoading });
      },

      setError(error: string | null) {
        patchState(store, { error });
      },

      // Load user from storage
      loadUserFromStorage() {
        const userJson = sessionStorage.getItem('jwt_user');
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            patchState(store, {
              currentUser: user,
              isAuthenticated: true,
            });
          } catch (e) {
            console.error('Failed to parse stored user', e);
            sessionStorage.removeItem('jwt_user');
          }
        }
      },

      // Login effect
      login: rxMethod<LoginRequestDto>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((credentials) =>
            http
              .post<LoginResponseDto>(`${rootUrl}/api/auth/login`, credentials)
              .pipe(
                tapResponse({
                  next: (response: {
                    refreshToken: string;
                    token: string;
                    user: any;
                  }) => {
                    // Store tokens
                    sessionStorage.setItem(
                      'refresh_token',
                      response.refreshToken
                    );
                    sessionStorage.setItem('jwt_token', response.token);
                    sessionStorage.setItem(
                      'jwt_user',
                      JSON.stringify(response.user)
                    );

                    patchState(store, {
                      currentUser: response.user,
                      isAuthenticated: true,
                      isLoading: false,
                      error: null,
                    });

                    router.navigate(['/']);
                  },
                  error: (error: any) => {
                    const errorMessage = error.error?.message || 'Login failed';
                    patchState(store, {
                      error: errorMessage,
                      isLoading: false,
                    });
                  },
                })
              )
          )
        )
      ),

      // Register effect
      register: rxMethod<RegisterRequestDto>(
        pipe(
          tap(() => patchState(store, { isLoading: true, error: null })),
          switchMap((credentials) =>
            http
              .post<UserDto>(`${rootUrl}/api/auth/register`, credentials)
              .pipe(
                tapResponse({
                  next: () => {
                    patchState(store, {
                      isLoading: false,
                      error: null,
                    });
                    router.navigate(['/login']);
                  },
                  error: (error: any) => {
                    const errorMessage =
                      error.error?.message || 'Registration failed';
                    patchState(store, {
                      error: errorMessage,
                      isLoading: false,
                    });
                  },
                })
              )
          )
        )
      ),

      logout() {
        sessionStorage.removeItem('jwt_token');
        sessionStorage.removeItem('jwt_user');
        sessionStorage.removeItem('refresh_token');

        patchState(store, initialState);
        router.navigate(['/login']);
      },

      // Update auth data after token refresh
      updateAuthData(response: LoginResponseDto) {
        sessionStorage.setItem('refresh_token', response.refreshToken);
        sessionStorage.setItem('jwt_token', response.token);
        sessionStorage.setItem('jwt_user', JSON.stringify(response.user));

        patchState(store, {
          currentUser: response.user,
          isAuthenticated: true,
        });
      },
    };
  })
);
