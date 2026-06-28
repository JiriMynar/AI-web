import { useLocalStorage } from "../lib/useLocalStorage";

/** Profil firmy ulozeny v prohlizeci. Sdili ho vic sekci. */
export type Profile = {
  zamereni: string;
  data: string;
  it: string;
  kapacita: string;
  cil: string;
};

export const DEFAULT_PROFILE: Profile = {
  zamereni: "",
  data: "",
  it: "",
  kapacita: "",
  cil: "",
};

export function useProfile() {
  return useLocalStorage<Profile>("velin.profile.v1", DEFAULT_PROFILE);
}
