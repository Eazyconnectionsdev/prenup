// ISO 3166-1 alpha-2 codes. Names come from the browser's own region names so
// the list stays short here and is always spelled consistently.
const CODES =
  "AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR XK KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN VG VI WF EH YE ZM ZW".split(
    " ",
  );

function regionName(code: string, names: Intl.DisplayNames | null): string {
  if (code === "XK") return "Kosovo";
  try {
    return names?.of(code) ?? code;
  } catch {
    return code;
  }
}

function buildCountries(): { value: string; label: string }[] {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames(["en-GB"], { type: "region" });
  } catch {
    names = null;
  }
  const all = CODES.map((code) => ({ value: code, label: regionName(code, names) })).sort(
    (a, b) => a.label.localeCompare(b.label),
  );
  // The UK first: almost every couple on the platform lives there.
  const uk = all.find((c) => c.value === "GB")!;
  return [uk, ...all.filter((c) => c.value !== "GB")];
}

export const COUNTRIES = buildCountries();

export const DEFAULT_COUNTRY = "GB";

export function countryName(code: string | null | undefined): string {
  if (!code) return "";
  return COUNTRIES.find((c) => c.value === code)?.label ?? code;
}
