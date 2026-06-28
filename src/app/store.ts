import { useLocalStorage } from "../lib/useLocalStorage";

/** Profil firmy uložený v prohlížeči. Sdílí ho víc sekcí. */
export type Profile = {
  // charakteristika podniku
  size: string;
  focus: string;
  it: string;
  kdeData: string;
  systemy: string;
  erpUsage: string;
  strojeData: string;
  procesy: string;
  uzivatele: string;
  zpusob: string;
  jazyky: string[];
  zkusenost: string;
  lide: string;
  regs: string[];
  // stanovení cílů
  vize: string[];
  ambition: string;
  horizont: string;
  objem: string;
  mereni: string;
  cil: string;
};

export const DEFAULT_PROFILE: Profile = {
  size: "",
  focus: "",
  it: "",
  kdeData: "",
  systemy: "",
  erpUsage: "",
  strojeData: "",
  procesy: "",
  uzivatele: "",
  zpusob: "",
  jazyky: [],
  zkusenost: "",
  lide: "",
  regs: [],
  vize: [],
  ambition: "",
  horizont: "",
  objem: "",
  mereni: "",
  cil: "",
};

export function useProfile() {
  return useLocalStorage<Profile>("velin.profile.v3", DEFAULT_PROFILE);
}
