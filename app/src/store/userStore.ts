import { create } from "zustand";

type User = {
  readonly userId: string;
  readonly email: string;
  readonly password: string;
  readonly fullName: string;
  readonly isAdmin: boolean;
  readonly isLoggedIn: boolean;
  readonly registeredAt: string;
};

type Store = {
  readonly user: User | undefined;
  readonly registrationHistory: readonly User[] | undefined;
  readonly setUserDetails: (user: User) => void;
  readonly setUserHistory: (history: User) => void;
  readonly deleteUser: (userId: string) => void;
  readonly loginDetails: User | undefined;
  readonly registerUser: (register: User) => {
    success: boolean;
    message: string;
  };
  readonly login: (
    email: string,
    password: string
  ) => {
    success: boolean;
    message: string;
  };
  readonly updateProfile: (updateUser: {
    fullName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    userId: string;
  }) => {
    success: boolean;
    message: string;
  };
};

export const useUserStore = create<Store>((set, get) => ({
  user: undefined,
  loginDetails: undefined,
  registrationHistory: [],
  setUserDetails: (user: User) => {
    set({ user });
  },
  setUserHistory: (history: User) => {
    set((state) => ({
      registrationHistory: [...state.registrationHistory, history],
    }));
  },
  deleteUser: (id: string) => {
    set((state) => ({
      user: state.user.userId === id ? undefined : state.user,
      registrationHistory: [
        ...state.registrationHistory.filter(({ userId }) => userId !== id),
      ],
    }));
  },
  registerUser: (register: User) => {
    set((state) => ({
      loginDetails: register,
      registrationHistory: [...state.registrationHistory, register],
    }));
    return { success: true, message: "" };
  },
  login: (email: string, password: string) => {
    const matchedUser = get().registrationHistory.find(
      (user) => user.email === email && user.password === password
    );

    if (matchedUser) {
      set((state) => ({
        loginDetails: matchedUser,
      }));
      return { success: true, message: "" };
    }

    return { success: false, message: "Invalid email/password" };
  },
  updateProfile: (updateUser: {
    fullName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    userId: string;
  }) => {
    const matchedUser = get().registrationHistory.find(
      ({ userId }) => userId === updateUser.userId
    );
    if (matchedUser) {
      set((state) => ({
        loginDetails: {
          ...state.loginDetails,
          email: updateUser.email,
          password: updateUser.password,
          fullName: updateUser.fullName,
          isAdmin: updateUser.isAdmin,
        },
        registrationHistory: [
          ...state.registrationHistory.filter(
            ({ userId }) => userId !== updateUser.userId
          ),
          {
            ...matchedUser,
            email: updateUser.email,
            password: updateUser.password,
            fullName: updateUser.fullName,
            isAdmin: updateUser.isAdmin,
          },
        ],
      }));

      return { success: true, message: "" };
    }

    return { success: false, message: "User not found" };
  },
}));
