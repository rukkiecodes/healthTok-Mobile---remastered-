import { createSlice } from "@reduxjs/toolkit"
import { SignupState } from "@/store/types/signup";

const initialState: SignupState = {
  name: '',
  email: '',
  password: '',
  acceptTerms: false,

  username: '',
  gender: '',
  birth: null,
  origin: ''
};

export const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setName: (state, action) => { state.name = action.payload },
    setEmail: (state, action) => { state.email = action.payload },
    setPassword: (state, action) => { state.password = action.payload },
    setAcceptTerms: (state, action) => { state.acceptTerms = action.payload },

    setUsername: (state, action) => { state.username = action.payload },
    setGender: (state, action) => { state.gender = action.payload },
    setBirth: (state, action) => { state.birth = action.payload },
    setOrigin: (state, action) => { state.origin = action.payload },
  }
})

export const {
  setName,
  setEmail,
  setPassword,
  setAcceptTerms,

  setUsername,
  setGender,
  setBirth,
  setOrigin
} = signupSlice.actions;

export default signupSlice.reducer;