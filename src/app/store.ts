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
  objem: string;
  mereni: string;
  uzivatele: string;
  jazyky: string[];
  zkusenost: string;
  lide: string;
  regs: string[];
  // stanovení cílů
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
  erpUsage: "",
  strojeData: "",
  procesy: "",
  objem: "",
  mereni: "",
  uzivatele: "",
  jazyky: [],
  zkusenost: "",
  lide: "",
  regs: [],
  vize: [],
  ambition: "",
  horizont: "",
  cil: "",
};

export function useProfile() {
  return useLocalStorage<Profile>("velin.profile.v3", DEFAULT_PROFILE);
}
