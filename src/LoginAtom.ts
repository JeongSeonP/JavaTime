import { atom, selector } from "recoil";

const loginID = atom({
  key: "loginID",
  default: null,
});

export const loginState = selector({
  key: "loginState",
  get: ({ get }) => !!get(loginID),
});
