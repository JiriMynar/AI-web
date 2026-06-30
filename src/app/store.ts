import { useLocalStorage } from "../lib/useLocalStorage";

/** Profil firmy uložený v prohlížeči. Sdílí ho víc sekcí. */
export type Profile = {
  // charakteristika podniku
  size: string;
  focus: string;
  it: string;
  kdeData: string;
  dataVen: string;
  systemy: string;
  erpUsage: string;
  strojeData: string;
  procesy: string;
  uzivatele: string;
  dovednosti: string;
  lide: string;
  zkusenost: string;
  zpusob: string;
  vyvoj: string;
  jazyky: string[];
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
  dataVen: "",
  systemy: "",
  erpUsage: "",
  strojeData: "",
  procesy: "",
  uzivatele: "",
  dovednosti: "",
  lide: "",
  zkusenost: "",
  zpusob: "",
  vyvoj: "",
  jazyky: [],
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
