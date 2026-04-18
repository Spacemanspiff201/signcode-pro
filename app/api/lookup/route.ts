import { NextRequest, NextResponse } from 'next/server';

// ── Sign Type Rule Interface ───────────────────────────────────────────────
interface SignTypeRules {
  maxStructureHeightFt?: number | string;
  maxFaceAreaSqft?: number | string;
  maxLetterHeightIn?: number | string;
  areaCalcMethod?: string;
  areaCalcValue?: number | string;
  maxPerTenant?: number | string;
  minSetbackRowFt?: number | string;
  minSetbackPropertyFt?: number | string;
  minClearanceGradeFt?: number | string;
  maxProjectionFromWallIn?: number | string;
  landscapingRequired?: boolean;
  illuminationAllowed?: boolean;
  illuminationTypes?: string[];
  faceLitAllowed?: boolean;
  reverseHaloLitAllowed?: boolean;
  openFaceNeonAllowed?: boolean;
  timeclockRequired?: boolean;
  photocellRequired?: boolean;
  astronomicalTimeclockRequired?: boolean;
  dimmingRequired?: boolean;
  hoursRestriction?: string;
  emcAllowed?: boolean;
  emcMinMessageHoldSec?: number;
  emcMaxBrightnessDay?: number;
  emcMaxBrightnessNight?: number;
  emcAnimationAllowed?: boolean;
  emcScrollingAllowed?: boolean;
  windowMaxCoveragePct?: number;
  tempMaxSqft?: number;
  tempPermitRequired?: boolean;
  codeSection?: string;
  verbatimText?: string;
  simplifiedText?: string;
  confidence?: 'verified' | 'high' | 'medium' | 'low';
  notes?: string;
}

interface ZoningDistrict {
  districtCode: string;
  districtName: string;
  overlay?: string;
  signTypes: {
    wall?: SignTypeRules;
    channelLetters?: SignTypeRules;
    monument?: SignTypeRules;
    pylon?: SignTypeRules;
    projecting?: SignTypeRules;
    window?: SignTypeRules;
    awning?: SignTypeRules;
    emc?: SignTypeRules;
    temporary?: SignTypeRules;
    directional?: SignTypeRules;
  };
}

interface JurisdictionData {
  jurisdiction: string;
  county?: string;
  lastVerified?: string;
  codeChapter?: string;
  portalUrl?: string;
  phone?: string;
  ownerSignatureRequired?: boolean;
  masterSignProgramRequired?: boolean;
  engineerSealRequired?: string;
  designReviewRequired?: boolean;
  contractorRegistrationRequired?: boolean;
  redFlags?: string[];
  requiredDocs?: string[];
  contacts?: { label: string; value: string }[];
  fees?: string;
  turnaround?: string;
  practitionerNotes?: string[];
  zoningDistricts?: ZoningDistrict[];
  maxHeight?: string;
  maxArea?: string;
  setback?: string;
  emcAllowed?: boolean;
  emcNotes?: string;
  codeLanguage?: { section: string; title: string; verbatim: string; simplified: string }[];
}

// ── JURISDICTION DATABASE ──────────────────────────────────────────────────
const JURISDICTIONS: Record<string, JurisdictionData> = {

  // ════════════════════════════════════════════════════════════════════════
  // DEERFIELD BEACH — Fully researched from Chapter 102, Sep 16 2024
  // Source: library.municode.com/fl/deerfield_beach
  // ════════════════════════════════════════════════════════════════════════
  'deerfield-beach': {
    jurisdiction: 'City of Deerfield Beach',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    codeChapter: 'Land Development Code Chapter 102 — Sign Code (Ord. 2024/009, effective June 4, 2024)',
    portalUrl: 'https://www.deerfield-beach.com/permits',
    phone: '(954) 480-4280',
    ownerSignatureRequired: true,
    masterSignProgramRequired: false,
    engineerSealRequired: 'Required per Florida Building Code wind load calculations',
    designReviewRequired: false,

    redFlags: [
      'Owner/property owner signature required on ALL permits — tenant signature alone is NOT sufficient',
      'All permanent freestanding signs must be monument style — NEW pole/pylon signs are PROHIBITED',
      'All illuminated building signs (except logos) must be channel or reverse channel letters — cabinet/pan face signs NOT permitted',
      'Monument sign base must match the architectural design and color of the building',
      'Landscaping required at base of ALL freestanding signs',
      'Business Tax Receipt and Certificate of Use required BEFORE sign approval',
      'Corner parcels with 100+ ft frontage on each street may have two monument signs',
      'Parcels with 700+ ft of frontage may qualify for an additional monument sign',
    ],

    requiredDocs: [
      'Completed sign permit application — property OWNER signature required',
      'Certificate of Use and active Business Tax Receipt',
      'Facade dimensions showing building elevation where sign will be installed (§102-6)',
      'Dimensioned sign drawings with sign area calculations',
      'Color rendering of proposed sign',
      'Survey showing sign location with dimensions to property lines (freestanding signs)',
      'Wind load calculations per Florida Building Code',
      'Electrical plans if illuminated',
      'Floor plan showing separate public entrance (multi-tenant buildings)',
    ],

    contacts: [
      { label: 'Building & Permitting', value: '(954) 480-4280' },
      { label: 'Planning & Zoning', value: '(954) 480-4280' },
      { label: 'Code Compliance', value: '(954) 480-4423' },
      { label: 'Permit Portal', value: 'https://www.deerfield-beach.com/permits' },
    ],

    fees: 'Based on sign value — contact building dept for current fee schedule per §98-22',
    turnaround: '2–4 weeks typical',

    practitionerNotes: [
      'Owner signature required on ALL permits — not just tenant. Get this early or the job stalls.',
      'No pole or pylon signs for new installs — monument only. Period.',
      'Cabinet/illuminated pan face signs not allowed — must be channel or reverse channel letters.',
      'Sign area = 1 sq ft per linear ft of building or tenant frontage.',
      'Monument base must match building color and architecture — inspect before fab.',
      'Astronomical timeclock NOT found in written code — verify electrical requirements at permit intake.',
      'EMC/digital signs not confirmed as permitted — verify with city before proposing to client.',
    ],

    zoningDistricts: [
      {
        districtCode: 'B-1 / B-2 / B-3',
        districtName: 'Commercial Zoning Districts',
        overlay: 'B-1 Business Community · B-2 Business Highway · B-3 Business General · TOD Transit-Oriented Development · Commercial uses in PDD Planned Development District',

        signTypes: {

          // ── WALL SIGNS ────────────────────────────────────────────────
          wall: {
            areaCalcMethod: 'per_linear_ft_frontage',
            areaCalcValue: 1,
            maxPerTenant: '1 per street frontage',
            illuminationAllowed: false,
            notes: 'Non-illuminated wall signs must be individually routed letters (§102-8(a)(2)). For illuminated wall signs, channel letters are required — see Channel Letters. One wall sign or awning sign per street frontage.',
            codeSection: '§102-8(a)(1-3), §102-11(b)',
            simplifiedText: 'One wall sign per street frontage. Area = 1 sq ft per linear ft of building or tenant frontage. Non-illuminated signs must be individually routed letters. Illuminated signs must be channel or reverse channel letters.',
            verbatimText: 'The total sign area shall be computed by allowing one sign per street frontage comprising one square foot for each linear foot of building or tenant frontage. All nonilluminated signs shall be individually routed letters.',
            confidence: 'verified',
          },

          // ── CHANNEL LETTERS ───────────────────────────────────────────
          channelLetters: {
            areaCalcMethod: 'per_linear_ft_frontage',
            areaCalcValue: 1,
            maxPerTenant: '1 per street frontage',
            illuminationAllowed: true,
            faceLitAllowed: true,
            reverseHaloLitAllowed: true,
            openFaceNeonAllowed: false,
            illuminationTypes: ['front_lit', 'reverse_halo_lit'],
            timeclockRequired: false,
            photocellRequired: false,
            astronomicalTimeclockRequired: false,
            notes: 'ALL illuminated building signs except logos MUST be channel or reverse channel letters per §102-8(a)(1). Cabinet/pan face illuminated signs are NOT permitted. Logos may use other illuminated formats. One sign per street frontage.',
            codeSection: '§102-8(a)(1)',
            simplifiedText: 'All illuminated signs except logos must be channel or reverse channel letters. Area = 1 sq ft per linear ft of frontage. One per street frontage. Front lit and reverse/halo lit allowed. Open face neon not confirmed.',
            verbatimText: 'All illuminated signs other than logos shall be channel or reverse channel letters.',
            confidence: 'verified',
          },

          // ── MONUMENT SIGNS ────────────────────────────────────────────
          monument: {
            maxStructureHeightFt: 10,
            areaCalcMethod: 'varies_by_setback',
            minSetbackPropertyFt: 'Required — setback from property line abutting ROW',
            landscapingRequired: true,
            illuminationAllowed: true,
            timeclockRequired: false,
            photocellRequired: false,
            astronomicalTimeclockRequired: false,
            notes: 'Max 10 ft height from existing average finished grade. All permanent freestanding signs must be monument style — no new pole signs. Base must match architectural design and color of building. Sign area varies by setback per §102-8(b) table. Landscaping required at base. One freestanding sign per property typically. Corner parcels with 100+ ft on each frontage may have one per frontage (min 100 ft apart). Parcels 700+ ft or multiple frontages may qualify for additional monument sign.',
            codeSection: '§102-8(b)(2), §102-8(b)(5-9), §102-11(c)',
            simplifiedText: 'Max 10 ft tall from grade. Must be monument style — no pole signs. Base matches building color and architecture. Landscaping required at base. Sign area varies by setback. One per property; corner lots with 100+ ft per frontage can have one per street frontage.',
            verbatimText: 'No freestanding monument sign shall exceed ten feet in height measured from the existing average finished grade level of the premises where the sign is located. All permanent freestanding signs shall be freestanding monument signs, unless expressly specified otherwise in this Code. The sign shall match the architectural design and color of the base of the sign shall match the color of the building.',
            confidence: 'verified',
          },

          // ── PYLON / POLE SIGNS ────────────────────────────────────────
          pylon: {
            notes: 'NEW pylon/pole signs are PROHIBITED in Deerfield Beach. All new permanent freestanding signs must be monument style per §102-8(b)(9). Existing nonconforming pole signs subject to amortization schedule per §102-13. If doing a face change on existing legal pole sign, pole cover (min 50% width of sign face) is required per §102-13.',
            codeSection: '§102-8(b)(9), §102-13',
            simplifiedText: 'Pylon and pole signs are NOT permitted for new installations. Monument signs only for any new freestanding sign. Existing legal pole signs may remain but require pole cover for face changes.',
            verbatimText: 'All permanent freestanding signs shall be freestanding monument signs, unless expressly specified otherwise in this Code.',
            confidence: 'verified',
          },

          // ── PROJECTING / BLADE SIGNS ──────────────────────────────────
          projecting: {
            illuminationAllowed: true,
            notes: 'Projecting signs allowed subject to general building sign regulations in §102-8(a). Must comply with general sign area calculations. Specific projection dimension limits not confirmed in current code review — verify maximum projection at permit intake.',
            codeSection: '§102-8(a)',
            simplifiedText: 'Projecting signs allowed under general building sign rules. Sign area counts toward frontage allowance. Verify specific projection limits at permit intake.',
            confidence: 'medium',
          },

          // ── WINDOW SIGNS ──────────────────────────────────────────────
          window: {
            notes: 'Window signs subject to general sign regulations. Specific window coverage percentage limit not confirmed in current code review. Verify at permit intake.',
            codeSection: '§102-8',
            simplifiedText: 'Window signs subject to general sign regulations. Verify specific coverage limits at permit intake.',
            confidence: 'medium',
          },

          // ── AWNING SIGNS ──────────────────────────────────────────────
          awning: {
            illuminationAllowed: false,
            notes: 'Awning signs are permitted as the single building sign alternative to a wall sign. Lettering must be silk-screened or permanently applied — no stick-on vinyl that can peel. Counts as the one building sign per street frontage.',
            codeSection: '§102-11(b)(3)',
            simplifiedText: 'Awning sign allowed as an alternative to wall sign (one per frontage). Lettering must be silk-screened or permanently applied.',
            verbatimText: 'The single building sign may consist of a wall sign or awning sign. If the sign is an awning sign, the lettering and numbering shall be either silk-screened or such other permanent application.',
            confidence: 'verified',
          },

          // ── EMC / DIGITAL SIGNS ───────────────────────────────────────
          emc: {
            emcAllowed: false,
            notes: 'EMC/digital signs not found as permitted in commercial sign code sections (§102-8, §102-11). The term "astronomical" and "timeclock" returned 0 results in Deerfield Beach code. Do not propose EMC without first verifying with the city that it is permitted for the specific property and zoning district.',
            codeSection: '§102-8, §102-11',
            simplifiedText: 'EMC/digital signs not confirmed as permitted. Verify with city before proposing to client.',
            confidence: 'medium',
          },

          // ── TEMPORARY SIGNS ───────────────────────────────────────────
          temporary: {
            tempMaxSqft: 32,
            maxStructureHeightFt: 6,
            tempPermitRequired: true,
            notes: 'One temporary single-sided ground mounted banner per business. Max 32 sq ft. Max 6 ft height. Must be on private property, parallel to the street frontage. Additional temporary sign types covered in §102-12 including new business signs and vacancy signs.',
            codeSection: '§102-12',
            simplifiedText: 'One temp banner: max 32 sq ft, max 6 ft height, single-sided, ground mounted on private property, parallel to street. Permit required.',
            verbatimText: 'One temporary single-sided ground mounted banner, not to exceed 32 square feet is permitted. The banner shall not to exceed six feet in height and shall be located on private property, parallel to the street frontage of the business.',
            confidence: 'verified',
          },

          // ── DIRECTIONAL SIGNS ─────────────────────────────────────────
          directional: {
            maxFaceAreaSqft: 3,
            maxStructureHeightFt: 3,
            notes: 'Freestanding directional signs: max 3 sq ft, max 3 ft height. Building directional signs: max 16 sq ft. No advertising copy, logos, or graphic display symbols — text or arrow for directional info only. Multi-tenant directional signs must match design of site signs and be included in master sign plan.',
            codeSection: '§102-8(d)',
            simplifiedText: 'Freestanding directional: max 3 sq ft / 3 ft height. Building directional: max 16 sq ft. No logos or ads — directional text/arrows only.',
            verbatimText: 'Shall not display advertising copy, logos or graphic display symbols, but may use text or arrow for directional information. Shall not exceed three square feet in size, for freestanding signs, and 16 square feet for building signs. Shall not exceed three feet in height, for freestanding signs.',
            confidence: 'verified',
          },
        },
      },
    ],

    maxHeight: '10 ft (monument)',
    maxArea: '1 sq ft per linear ft of frontage',
    setback: 'Required — setback from property line abutting ROW',
    emcAllowed: false,
    emcNotes: 'EMC not confirmed as permitted. Verify with city before proposing.',

    codeLanguage: [
      {
        section: '§102-8(a)(1)',
        title: 'Illuminated Signs Must Be Channel Letters',
        verbatim: 'All illuminated signs other than logos shall be channel or reverse channel letters.',
        simplified: 'Every illuminated sign except logos must be channel or reverse/halo channel letters. No lit cabinet signs or pan faces.',
      },
      {
        section: '§102-8(a)(2)',
        title: 'Non-Illuminated Signs Must Be Routed Letters',
        verbatim: 'All nonilluminated signs shall be individually routed letters.',
        simplified: 'Non-illuminated signs must use individually routed letters — no flat vinyl or painted backer boards.',
      },
      {
        section: '§102-8(a)(3)',
        title: 'Sign Area = 1 Sq Ft Per Linear Ft of Frontage',
        verbatim: 'The total sign area shall be computed by allowing one sign per street frontage comprising one square foot for each linear foot of building or tenant frontage.',
        simplified: 'Sign area = 1 sq ft per linear ft of your building or tenant space frontage. One sign per street frontage.',
      },
      {
        section: '§102-8(b)(7)',
        title: 'Monument Sign Max Height — 10 Ft',
        verbatim: 'No freestanding monument sign shall exceed ten feet in height measured from the existing average finished grade level of the premises where the sign is located.',
        simplified: 'Monument signs cannot exceed 10 ft tall, measured from the existing average grade of the property.',
      },
      {
        section: '§102-8(b)(9)',
        title: 'No New Pole Signs — Monument Only',
        verbatim: 'All permanent freestanding signs shall be freestanding monument signs, unless expressly specified otherwise in this Code.',
        simplified: 'New pole/pylon signs are banned. All new permanent freestanding signs must be monument style.',
      },
      {
        section: '§102-8(b)(2)',
        title: 'Monument Base Must Match Building',
        verbatim: 'The sign shall match the architectural design and color of the base of the sign shall match the color of the building.',
        simplified: 'The monument sign base must match the building\'s architectural design and color.',
      },
      {
        section: '§102-8(b)(5)',
        title: 'Freestanding Signs — Setback Required',
        verbatim: 'All freestanding signs shall be setback from the property line abutting the public right-of-way.',
        simplified: 'All freestanding signs must maintain setback from the property line adjacent to the public ROW.',
      },
      {
        section: '§102-8(b)(4)',
        title: 'Landscaping Required at Base',
        verbatim: 'Landscaping elements shall be provided around the base of all free-standing signs.',
        simplified: 'Landscaping is required around the base of every freestanding sign.',
      },
      {
        section: '§102-11(b)(3)',
        title: 'Wall Sign or Awning Sign — One Per Frontage',
        verbatim: 'The single building sign may consist of a wall sign or awning sign. If the sign is an awning sign, the lettering and numbering shall be either silk-screened or such other permanent application.',
        simplified: 'One building sign per street frontage — wall sign or awning sign. Awning lettering must be permanently applied.',
      },
      {
        section: '§102-11(b)(5)',
        title: 'Second Wall Sign — Buildings Facing Private Drive',
        verbatim: 'All buildings that face a private drive aisle may have an additional wall sign, located on the rear or side elevation of the building. The second sign shall match the primary facade wall sign in color, illumination method and method of construction. No signs at the rear of a building visible to any adjacent residential property shall be illuminated.',
        simplified: 'Buildings facing a private drive aisle can have a second wall sign on rear or side — must match primary sign in color, illumination, and construction. Cannot be illuminated if visible to adjacent residential.',
      },
      {
        section: '§102-11(c)(3)',
        title: 'Corner Parcels — Two Monument Signs Allowed',
        verbatim: 'Corner parcels having more than 100 feet of frontage on each street may have two freestanding monument signs, one for each frontage, provided they are no closer than 100 feet, as measured along the frontage.',
        simplified: 'Corner parcels with 100+ ft of frontage on each street can have one monument sign per frontage — minimum 100 ft apart.',
      },
      {
        section: '§102-12',
        title: 'Temporary Signs — Banner Rules',
        verbatim: 'One temporary single-sided ground mounted banner, not to exceed 32 square feet is permitted. The banner shall not to exceed six feet in height and shall be located on private property, parallel to the street frontage of the business.',
        simplified: 'One temp banner: max 32 sq ft, max 6 ft tall, single-sided, ground mounted, private property, parallel to street.',
      },
      {
        section: '§102-5',
        title: 'Owner Signature + Business Tax Receipt Required',
        verbatim: 'All businesses shall be required to obtain a valid certificate of use and active business tax receipt to obtain a sign for their business.',
        simplified: 'Property owner must sign the permit. Certificate of Use and active Business Tax Receipt required before any sign permit is issued.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // MIAMI-DADE COUNTY
  // ════════════════════════════════════════════════════════════════════════
  'miami-dade': {
    jurisdiction: 'Miami-Dade County',
    county: 'Miami-Dade County (Unincorporated)',
    lastVerified: '2026-04-18',
    maxHeight: '35 ft',
    maxArea: '150 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed with restrictions. No flashing or animation near residential.',
    engineerSealRequired: 'Required for any sign over 24 sq ft',
    requiredDocs: [
      'Completed Miami-Dade Building Permit Application',
      'Signed and sealed engineer drawings (required over 24 sq ft)',
      'Site plan showing sign location, setbacks, and ROW',
      'Electrical plans if illuminated (ELEC.03 application)',
      'Survey or recorded plat',
      'Adjacent municipality approval letter if applicable',
      'Shop inspection certificate for fabricated signs',
      'Certificate of Use',
      'Wind load calculations (Florida Building Code)',
      'Two sets of plans: office copy and job copy',
    ],
    contacts: [
      { label: 'Miami-Dade Building', value: '(786) 315-2000' },
      { label: 'Permit Portal', value: 'https://epermits.miamidade.gov' },
    ],
    fees: 'Variable — engineer seal adds cost',
    turnaround: '4–8 weeks',
    redFlags: [
      'Engineer seal required on ALL signs over 24 sq ft',
      'Shop inspection required before final inspection',
      'Adjacent municipality approval if near city boundary',
      'Two sets of plans required — office copy and job copy',
    ],
    practitionerNotes: [
      'Engineer seal mandatory over 24 sq ft — budget for this upfront.',
      'Shop inspection is a real required step — do not skip or assume it waived.',
      'Two sets of plans — not one.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // BROWARD COUNTY
  // ════════════════════════════════════════════════════════════════════════
  'broward': {
    jurisdiction: 'Broward County',
    county: 'Broward County (Unincorporated)',
    lastVerified: '2026-04-18',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial districts with restrictions.',
    requiredDocs: [
      'Broward County Building Permit Application',
      'Site plan with sign location and setbacks',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
      'Property owner authorization',
    ],
    contacts: [
      { label: 'Broward Building', value: '(954) 765-4400' },
      { label: 'Permit Portal', value: 'https://epermits.broward.org' },
    ],
    fees: 'Based on project value',
    turnaround: '3–5 weeks',
    redFlags: [
      'Timeclock required on freestanding illuminated signs in Broward County',
      'Very small unincorporated footprint — verify address is not within a municipality',
    ],
    practitionerNotes: [
      'Timeclock required on freestanding illuminated signs.',
      'Always verify the address is truly unincorporated — most Broward addresses are within a city.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // PALM BEACH COUNTY
  // ════════════════════════════════════════════════════════════════════════
  'palm-beach': {
    jurisdiction: 'Palm Beach County',
    county: 'Palm Beach County (Unincorporated)',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '15 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed with message hold time and brightness restrictions.',
    requiredDocs: [
      'Palm Beach County Building Permit Application',
      'Site plan with dimensions',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'PBC Building', value: '(561) 233-5000' },
      { label: 'Permit Portal', value: 'https://pbcgov.org/pzb' },
    ],
    fees: 'Tiered by sign type and area',
    turnaround: '3–6 weeks',
    redFlags: [
      'Sign allowances vary by road classification — verify roadway type first',
    ],
    practitionerNotes: [
      'Sign allowances differ significantly based on whether the road is arterial vs collector.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF FORT LAUDERDALE
  // ════════════════════════════════════════════════════════════════════════
  'fort-lauderdale': {
    jurisdiction: 'City of Fort Lauderdale',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial zones.',
    contractorRegistrationRequired: true,
    requiredDocs: [
      'Fort Lauderdale Sign Permit Application',
      'City contractor registration certificate',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
      'Property owner authorization',
    ],
    contacts: [
      { label: 'Fort Lauderdale Building', value: '(954) 828-6520' },
      { label: 'Permit Portal', value: 'https://fortlauderdale.gov/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: [
      'Contractor MUST register with the City — state license alone is NOT accepted',
    ],
    practitionerNotes: [
      'City contractor registration is required — state license alone will get permit rejected.',
      'Register with city first before attempting to pull any permits.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF POMPANO BEACH
  // ════════════════════════════════════════════════════════════════════════
  'pompano-beach': {
    jurisdiction: 'City of Pompano Beach',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '16 ft (freestanding nonresidential)',
    maxArea: '36 sq ft (wall nonresidential)',
    setback: '6 ft min from property line',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial districts with restrictions.',
    masterSignProgramRequired: true,
    requiredDocs: [
      'Sign Code Compliance Permit Application',
      'Business Tax Receipt',
      'Four (4) compiled sets of plans',
      'Facade dimensions and elevation',
      'Color rendering of proposed sign',
      'Floor plan showing separate public entrance (multi-tenant)',
      'Native vegetation and irrigation plan (freestanding)',
      'Master Sign Program confirmation — required on all permits since 2022',
      'AAC design review approval if in Atlantic Boulevard Overlay District',
      'Sealed survey of property (freestanding signs)',
    ],
    contacts: [
      { label: 'Pompano Planning & Zoning', value: '(954) 786-4634' },
      { label: 'Permit Portal', value: 'https://pompanobeachfl.gov/permits' },
    ],
    fees: 'No fee for Master Sign Program. Permit fees vary.',
    turnaround: '3–6 weeks; longer if AAC review required',
    redFlags: [
      'Master Sign Program mandatory since 2022 — NO permit approved without MSP on file',
      'AAC review required for Atlantic Boulevard Overlay District multi-tenant buildings',
      'FOUR (4) compiled sets of plans required',
      'Sealed survey required for all freestanding signs',
      'Pole cover (min 50% of sign face width) required for any face change on existing pole sign',
    ],
    practitionerNotes: [
      'MSP mandatory since 2022 — always confirm MSP is on file before starting any permit work.',
      'Atlantic Blvd overlay means AAC review — budget 4–6 extra weeks for that process.',
      'Four sets of plans — not one.',
    ],
    codeLanguage: [
      {
        section: '§156.13',
        title: 'Freestanding Sign Permit Submittal',
        verbatim: 'Applications for freestanding and projecting signs shall also include a fully dimensioned site plan, to scale, indicating the proposed height of the sign(s) and the property lines, rights-of-way, streets, sidewalks, overhead utility lines, parking areas, and any building or structures on the premises, details of the surrounding landscaping, and a sealed survey of the property on which the sign is to be displayed.',
        simplified: 'Freestanding sign permits require a fully dimensioned site plan plus a sealed survey.',
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF BOCA RATON
  // ════════════════════════════════════════════════════════════════════════
  'boca-raton': {
    jurisdiction: 'City of Boca Raton',
    county: 'Palm Beach County',
    lastVerified: '2026-04-18',
    maxHeight: '8 ft (monument)',
    maxArea: '40 sq ft',
    setback: '5 ft from property line',
    emcAllowed: false,
    emcNotes: 'EMC/digital signs are COMPLETELY BANNED in ALL zoning districts.',
    designReviewRequired: true,
    requiredDocs: [
      'Sign Permit Application',
      'Design Review Board (DRB) application and approval',
      'Site plan with dimensions',
      'Sign construction drawings',
      'Color renderings',
      'Wind load calculations',
      'Electrical permit application',
      'Property owner authorization',
    ],
    contacts: [
      { label: 'Boca Raton Building', value: '(561) 393-7750' },
      { label: 'Permit Portal', value: 'https://myboca.us/permits' },
    ],
    fees: 'DRB application fee + permit fee',
    turnaround: '8–12 weeks minimum due to DRB',
    redFlags: [
      'EMC/digital signs are completely BANNED — never propose EMC here',
      'Design Review Board (DRB) approval required before permit — 8–12 weeks minimum',
      'Most restrictive sign code in South Florida',
    ],
    practitionerNotes: [
      'Never propose EMC in Boca Raton. Instant denial.',
      'DRB is required — plan for 8–12 week minimum before permit.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF MIAMI BEACH
  // ════════════════════════════════════════════════════════════════════════
  'miami-beach': {
    jurisdiction: 'City of Miami Beach',
    county: 'Miami-Dade County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '60 sq ft',
    setback: '5 ft from ROW',
    emcAllowed: false,
    emcNotes: 'No EMC. Historic districts require HPB approval.',
    requiredDocs: [
      'Miami Beach Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Historic Preservation Board approval (if in historic district)',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'Miami Beach Building', value: '(305) 673-7610' },
      { label: 'Permit Portal', value: 'https://miamibeachfl.gov/permits' },
    ],
    fees: 'Variable — HPB adds cost',
    turnaround: '4–8 weeks; 12+ weeks in historic districts',
    redFlags: [
      'No EMC anywhere in Miami Beach',
      'Historic districts require HPB approval — significant additional time and cost',
    ],
    practitionerNotes: [
      'Check historic district status before quoting timeline to client.',
      'No EMC anywhere. Do not propose.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF ORLANDO
  // ════════════════════════════════════════════════════════════════════════
  'orlando': {
    jurisdiction: 'City of Orlando',
    county: 'Orange County',
    lastVerified: '2026-04-18',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed with restrictions. Downtown CRA requires ARB approval.',
    requiredDocs: [
      'Orlando Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
      'ARB approval if in downtown CRA',
    ],
    contacts: [
      { label: 'Orlando Building', value: '(407) 246-2271' },
      { label: 'Permit Portal', value: 'https://permits.cityoforlando.net' },
    ],
    fees: 'Variable',
    turnaround: '3–6 weeks',
    redFlags: ['Downtown CRA areas require ARB approval'],
    practitionerNotes: ['Verify CRA district — ARB adds significant time.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF TAMPA
  // ════════════════════════════════════════════════════════════════════════
  'tampa': {
    jurisdiction: 'City of Tampa',
    county: 'Hillsborough County',
    lastVerified: '2026-04-18',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed. Historic districts require ARC Certificate of Appropriateness.',
    requiredDocs: [
      'Tampa Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
      'ARC Certificate of Appropriateness (historic districts)',
    ],
    contacts: [
      { label: 'Tampa Building', value: '(813) 274-3100' },
      { label: 'Permit Portal', value: 'https://tampa.gov/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–6 weeks',
    redFlags: ['Historic districts require ARC Certificate of Appropriateness'],
    practitionerNotes: ['Check Ybor City and Hyde Park district boundaries before proposing.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // HILLSBOROUGH COUNTY
  // ════════════════════════════════════════════════════════════════════════
  'hillsborough': {
    jurisdiction: 'Hillsborough County',
    county: 'Hillsborough County (Unincorporated)',
    lastVerified: '2026-04-18',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed with restrictions in unincorporated areas.',
    requiredDocs: [
      'Hillsborough County Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'Hillsborough Building', value: '(813) 272-5600' },
      { label: 'Permit Portal', value: 'https://hcfl.gov/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: ['Verify address is truly unincorporated — many fall within Tampa, Temple Terrace, or Plant City'],
    practitionerNotes: ['Always verify unincorporated status before pulling a county permit.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF HOLLYWOOD
  // ════════════════════════════════════════════════════════════════════════
  'hollywood': {
    jurisdiction: 'City of Hollywood',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial districts.',
    requiredDocs: [
      'Hollywood Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
      'Sign tag — must be posted on site before inspection',
    ],
    contacts: [
      { label: 'Hollywood Building', value: '(954) 967-4500' },
      { label: 'Permit Portal', value: 'https://epermitsonestop.com' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: ['Sign tag must be posted on site BEFORE inspection or inspector will not come out'],
    practitionerNotes: ['Post sign tag on site before calling for inspection.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF PEMBROKE PINES
  // ════════════════════════════════════════════════════════════════════════
  'pembroke-pines': {
    jurisdiction: 'City of Pembroke Pines',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial districts.',
    requiredDocs: [
      'Pembroke Pines Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'Pembroke Pines Building (CGA)', value: '(954) 432-8000' },
      { label: 'Permit Portal', value: 'https://cga-corp.com/pembroke-pines' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: ['Building department managed by CGA Solutions (third-party) — not city hall directly'],
    practitionerNotes: ['Go through CGA Solutions for all permits — not city hall.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF CORAL SPRINGS
  // ════════════════════════════════════════════════════════════════════════
  'coral-springs': {
    jurisdiction: 'City of Coral Springs',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed with restrictions.',
    requiredDocs: [
      'Coral Springs Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Color rendering (often required)',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'Coral Springs Building', value: '(954) 344-1130' },
      { label: 'Permit Portal', value: 'https://coralsprings.org/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: [
      'Active code enforcement — unpermitted signs get noticed quickly',
      'Color rendering often required even for simple wall signs',
    ],
    practitionerNotes: [
      'Never install before permit in hand — code enforcement is active.',
      'Bring color rendering even if not explicitly required.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF MIRAMAR
  // ════════════════════════════════════════════════════════════════════════
  'miramar': {
    jurisdiction: 'City of Miramar',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial districts.',
    requiredDocs: [
      'Miramar Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'Miramar Building', value: '(954) 602-3000' },
      { label: 'Permit Portal', value: 'https://miramarfl.gov/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: ['Miramar Parkway business park area has its own design standards'],
    practitionerNotes: ['Verify if in Miramar Parkway corridor — separate design criteria apply.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF WEST PALM BEACH
  // ════════════════════════════════════════════════════════════════════════
  'west-palm-beach': {
    jurisdiction: 'City of West Palm Beach',
    county: 'Palm Beach County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed with restrictions.',
    requiredDocs: [
      'West Palm Beach Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'WPB Building', value: '(561) 822-1477' },
      { label: 'Permit Portal', value: 'https://wpb.org/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: ['West Palm Beach is NOT Palm Beach County — completely separate jurisdiction'],
    practitionerNotes: ['Separate city from Palm Beach County. Different code, different office.'],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF DELRAY BEACH
  // ════════════════════════════════════════════════════════════════════════
  'delray-beach': {
    jurisdiction: 'City of Delray Beach',
    county: 'Palm Beach County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '60 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in some districts — verify by zoning.',
    requiredDocs: [
      'Delray Beach Sign Permit Application — separate application per sign',
      'Qualifier signature — must be notarized',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
    ],
    contacts: [
      { label: 'Delray Beach Building', value: '(561) 243-7200' },
      { label: 'Permit Portal', value: 'https://eplans.delraybeach.com' },
    ],
    fees: 'Separate fee per sign. Triple fees for unpermitted signs.',
    turnaround: '3–5 weeks',
    redFlags: [
      'Separate permit required per sign — one application per sign',
      'Qualifier must sign AND notarize the application',
      'Triple fees for any unpermitted signs found during inspection',
    ],
    practitionerNotes: [
      'One permit per sign — never combine on one application.',
      'Notarized qualifier signature is required — get it early.',
      'Triple fee penalty for unpermitted signs is actively enforced.',
    ],
    codeLanguage: [],
  },

  // ════════════════════════════════════════════════════════════════════════
  // CITY OF SUNRISE
  // ════════════════════════════════════════════════════════════════════════
  'sunrise': {
    jurisdiction: 'City of Sunrise',
    county: 'Broward County',
    lastVerified: '2026-04-18',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial districts. Sawgrass Mills area governed by MSP.',
    requiredDocs: [
      'Sunrise Sign Permit Application',
      'Site plan with sign location',
      'Sign construction drawings',
      'Wind load calculations',
      'Electrical plans if illuminated',
      'Sawgrass Mills MSP compliance documents (if in mall area)',
    ],
    contacts: [
      { label: 'Sunrise Building', value: '(954) 746-3210' },
      { label: 'Permit Portal', value: 'https://sunrisefl.gov/permits' },
    ],
    fees: 'Variable',
    turnaround: '3–5 weeks',
    redFlags: ['Sawgrass Mills Mall has its own Master Sign Program — MSP compliance required'],
    practitionerNotes: ['Get Sawgrass Mills MSP criteria from property management before any permit work.'],
    codeLanguage: [],
  },

};

// ── API Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { jurisdiction } = await req.json();
    if (!jurisdiction) {
      return NextResponse.json({ error: 'Jurisdiction required' }, { status: 400 });
    }
    const key = jurisdiction.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/^city-of-/, '')
      .replace(/^county-of-/, '');
    const data = JURISDICTIONS[key];
    if (!data) {
      return NextResponse.json({ error: `Jurisdiction "${jurisdiction}" not found` }, { status: 404 });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Lookup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jurisdiction = searchParams.get('jurisdiction');
  if (!jurisdiction) {
    return NextResponse.json({ jurisdictions: Object.keys(JURISDICTIONS) });
  }
  const key = jurisdiction.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^city-of-/, '')
    .replace(/^county-of-/, '');
  const data = JURISDICTIONS[key];
  if (!data) {
    return NextResponse.json({ error: `Jurisdiction "${jurisdiction}" not found` }, { status: 404 });
  }
  return NextResponse.json({ success: true, data });
}
