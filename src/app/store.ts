import { useLocalStorage } from "../lib/useLocalStorage";

/** Profil firmy ulozeny v prohlizeci. Sdili ho vic sekci. */
export type Profile = {
  // charakteristika podniku
  size: string;
  focus: string;
  it: string;
  kdeData: string;
  systemy: string;
  procesy: string;
  objem: string;
  mereni: string;
  regs: string[];
  // stanoveni cilu
  vize: string[];
  ambition: string;
  horizont: string;
  cil: string;
};

export const DEFAULT_PROFILE: Profile = {
  size: "",
  focus: "",
  it: "",
  kdeData: "",
  systemy: "",
  procesy: "",
  objem: "",
  mereni: "",
  regs: [],
  vize: [],
  ambition: "",
  horizont: "",
  cil: "",
};

export function useProfile() {
  return useLocalStorage<Profile>("velin.profile.v2", DEFAULT_PROFILE);
}
