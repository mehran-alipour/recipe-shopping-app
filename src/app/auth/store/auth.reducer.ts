import { User } from "../user.model"
import * as AuthActions from "./auth.actions"


export interface State {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  isLoading: false
}

export function authReducer (state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.AUTH_SUCCESS:
      const user = new User(
        action.payload.email, 
        action.payload.userId, 
        action.payload.token, 
        action.payload.expirationDate
      );
      return {
        ...state,
        authError: null,
        user: user,
        isloading: false
      };

    case AuthActions.LOGOUT:
      return{
        ...state,
        user: null,
        isLoading: false
      };

    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return{
        ...state,
        authError: null,
        isLoading: true
      };

    case AuthActions.AUTH_FAIL:
      return{
        ...state,
        user: null,
        authError: action.payload,
        isLoading: false
      };

    case AuthActions.CLEAR_ERROR:
      return{
        ...state,
        authError: null,
        isLoading: false
      }

    default:
      return state;
  }
} 