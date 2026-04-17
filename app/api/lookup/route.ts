import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// ── Types ──────────────────────────────────────────────────────────────────
interface CodeSection {
  section: string;
  title: string;
  verbatim: string;
  simplified: string;
}

interface JurisdictionData {
  jurisdiction: string;
  county?: string;
  maxHeight?: string;
  maxArea?: string;
  setback?: string;
  emcAllowed?: boolean;
  emcNotes?: string;
  requiredDocs?: string[];
  redFlags?: string[];
  contacts?: { label: string; value: string }[];
  fees?: string;
  turnaround?: string;
  practitionerNotes?: string[];
  codeLanguage?: CodeSection[];
}

// ── Jurisdiction database ──────────────────────────────────────────────────
const JURISDICTIONS: Record<string, JurisdictionData> = {

  // ── MIAMI-DADE COUNTY ────────────────────────────────────────────────────
  'miami-dade': {
    jurisdiction: 'Miami-Dade County',
    county: 'Miami-Dade County (Unincorporated)',
    maxHeight: '35 ft',
    maxArea: '150 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC/changeable copy allowed with restrictions; no flashing or animation in residential proximity.',
    requiredDocs: [
      'Completed Miami-Dade Building Permit Application (PDOX)',
      'Signed and sealed engineer drawings (required for any sign over 24 sq ft)',
      'Site plan showing sign location, setbacks, and ROW',
      'Electrical plans if illuminated',
      'Survey or recorded plat',
      'Adjacent municipality approval letter if applicable',
      'Shop inspection certificate for fabricated signs',
      'Contractor license & insurance certificates',
      'Owner/agent authorization letter',
    ],
    redFlags: [
      'Engineer seal required on ALL signs over 24 sq ft — no exceptions',
      'Adjacent municipality approval needed if sign is visible from incorporated city',
      'Shop inspection required before field installation for fabricated sign structures',
      'Unincorporated areas only — verify address is NOT within any incorporated municipality',
      'Signs within 300 ft of residential zoning require additional shielding review',
      'Master Sign Programs apply in several commercial corridors — check before designing',
    ],
    contacts: [
      { label: 'Permit Portal', value: 'ePermits.miamidade.gov' },
      { label: 'Building Dept', value: '(786) 315-2000' },
      { label: 'Zoning Division', value: '(305) 375-2800' },
    ],
    fees: 'Base $150 + $4.50/sq ft',
    turnaround: '3–5 weeks',
    practitionerNotes: [
      'Call zoning BEFORE submitting if the address is near a city boundary — the jurisdiction line is not always obvious on maps.',
      'The shop inspection requirement is strictly enforced; schedule it early or it will delay your pull date.',
      'Engineer drawings must bear a Florida PE seal — out-of-state seals are rejected.',
    ],
    codeLanguage: [
      {
        section: '§33-84',
        title: 'Permit Required',
        verbatim: 'No sign shall be erected, altered, relocated or maintained unless a building permit has been obtained from the Department of Regulatory and Economic Resources. Each sign shall require a separate permit.',
        simplified: 'Every sign needs its own separate building permit. You cannot install, move, or change a sign without getting permit approval first from Miami-Dade\'s building department.',
      },
      {
        section: '§33-87(b)',
        title: 'Engineer Seal Threshold',
        verbatim: 'All signs exceeding twenty-four (24) square feet in area, or any freestanding sign, shall require signed and sealed drawings prepared by a Florida-licensed Professional Engineer or Architect.',
        simplified: 'Any sign bigger than 24 square feet — or any freestanding pole/monument sign regardless of size — must have engineer-stamped drawings. Budget for a PE seal on almost every commercial sign job.',
      },
      {
        section: '§33-84.3',
        title: 'Adjacent Municipality Approval',
        verbatim: 'Where a proposed sign is located in unincorporated Miami-Dade County but is visible from the right-of-way of an adjacent incorporated municipality, written approval from that municipality\'s governing body or designee shall be required prior to permit issuance.',
        simplified: 'If your sign can be seen from a city\'s road (even though the property is in unincorporated county), you need a written OK from that city before Miami-Dade will issue the permit. This is common near Hialeah, Miami Gardens, and Doral borders.',
      },
      {
        section: '§33-91(a)',
        title: 'Maximum Height — Freestanding Signs',
        verbatim: 'Freestanding signs shall not exceed thirty-five (35) feet in height, measured from the established grade at the base of the sign to the highest point of the sign structure.',
        simplified: 'Pole and monument signs top out at 35 feet. Height is measured from ground level at the sign base — not from the road.',
      },
    ],
  },

  // ── BROWARD COUNTY ───────────────────────────────────────────────────────
  'broward': {
    jurisdiction: 'Broward County (Unincorporated)',
    county: 'Broward County',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; 8-second minimum message hold; prohibited within 150 ft of residential zoning.',
    requiredDocs: [
      'Broward County Permit Application',
      'Site plan with dimensions, setbacks, and street ROW',
      'Structural/electrical drawings signed and sealed by FL PE',
      'Survey or lot dimensions',
      'Contractor license and liability insurance',
      'Owner authorization letter',
    ],
    redFlags: [
      'Unincorporated Broward is a small footprint — most addresses fall inside municipalities',
      'Confirm address is truly unincorporated before submitting; Google Maps jurisdiction lines are often wrong',
      'EMC signs require minimum 8-second dwell time per message',
      'No animated, flashing, or scrolling text on EMC within 150 ft of any residential district',
    ],
    contacts: [
      { label: 'Building Division', value: '(954) 765-4400' },
      { label: 'Permit Portal', value: 'ePermits.broward.org' },
      { label: 'Zoning', value: '(954) 357-6602' },
    ],
    fees: 'Base $110 + $3.50/sq ft',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'Broward unincorporated is mostly industrial/warehouse corridors near the Turnpike and I-75 area.',
      'Many "Broward County" addresses are actually inside Davie, Dania Beach, or Pembroke Park — verify at bcpa.net.',
    ],
    codeLanguage: [
      {
        section: '§39-102',
        title: 'Permit Required',
        verbatim: 'It shall be unlawful for any person to erect, construct, alter, repair, or maintain any sign within the unincorporated area of Broward County without first obtaining a permit as required by this chapter.',
        simplified: 'You need a permit for any sign work — new, altered, or repaired — in unincorporated Broward. No exceptions.',
      },
      {
        section: '§39-118(c)',
        title: 'Electronic Message Signs — Dwell Time',
        verbatim: 'Electronic message center signs shall display each message for a minimum of eight (8) seconds before transitioning to the next message. Transitional effects shall not exceed one (1) second in duration. Flashing, scrolling, or animated displays are prohibited.',
        simplified: 'Each message on a digital sign must stay on screen for at least 8 seconds. Quick fades are OK (under 1 sec). No flashing, scrolling text, or animations — ever.',
      },
      {
        section: '§39-112(a)',
        title: 'Maximum Freestanding Sign Height',
        verbatim: 'No freestanding sign shall exceed twenty-five (25) feet in height above the natural grade at the base of the sign support structure.',
        simplified: 'Max pole/monument height is 25 feet measured from natural ground level. No raising the grade artificially to gain extra height.',
      },
    ],
  },

  // ── PALM BEACH COUNTY ────────────────────────────────────────────────────
  'palm-beach': {
    jurisdiction: 'Palm Beach County',
    county: 'Palm Beach County (Unincorporated)',
    maxHeight: '20–45 ft (tiered by road classification)',
    maxArea: '64–200 sq ft (tiered)',
    setback: '15 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted; 6-second minimum hold; prohibited within 200 ft of residential zoning.',
    requiredDocs: [
      'Palm Beach County Sign Permit Application',
      'Sealed structural and electrical drawings',
      'Site plan showing setbacks and road classification',
      'Survey',
      'Road classification verification (Arterial / Collector / Local)',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Sign allowances are TIERED by road classification — arterial roads get bigger signs than collectors or locals',
      'Must document which road classification the property fronts before designing the sign',
      'Overlay zones along US-1 and SR-80 corridors have additional design review requirements',
      'EMC prohibited within 200 ft of any residential zoning boundary',
    ],
    contacts: [
      { label: 'Building Division', value: '(561) 233-5000' },
      { label: 'Permit Portal', value: 'pbcgov.org/pzb' },
      { label: 'Zoning', value: '(561) 233-5200' },
    ],
    fees: 'Base $135 + $4/sq ft',
    turnaround: '3–5 weeks',
    practitionerNotes: [
      'Always pull the road classification map first — designing to the wrong tier is the #1 mistake in Palm Beach County.',
      'US-1 corridor has extra scrutiny; contact zoning for a pre-application meeting on larger projects.',
    ],
    codeLanguage: [
      {
        section: '§8.5.1.A',
        title: 'Road Classification Tiers',
        verbatim: 'The maximum permitted sign area and height shall be determined by the functional classification of the road upon which the property has its primary frontage, as follows: (1) Arterials — 200 sq ft / 45 ft height; (2) Collectors — 100 sq ft / 30 ft height; (3) Local Roads — 64 sq ft / 20 ft height.',
        simplified: 'Your maximum sign size and height depends on the type of road your property faces. Arterial (major) roads allow the biggest signs (200 sq ft, 45 ft tall). Collector roads are mid-range (100 sq ft, 30 ft). Local streets get the smallest allowance (64 sq ft, 20 ft).',
      },
      {
        section: '§8.5.3.C',
        title: 'Electronic Message Centers',
        verbatim: 'Electronic message center signs shall be permitted only in the General Commercial (CG) and Planned Commercial (PC) zoning districts, shall not be located within two hundred (200) feet of any residentially zoned parcel, and shall display each message for a minimum period of six (6) seconds.',
        simplified: 'EMC signs are only allowed in commercial zones (CG and PC). They must be at least 200 feet from any residential property, and each message must display for at least 6 seconds.',
      },
    ],
  },

  // ── FORT LAUDERDALE ──────────────────────────────────────────────────────
  'fort-lauderdale': {
    jurisdiction: 'City of Fort Lauderdale',
    county: 'Broward County',
    maxHeight: '20 ft (standard); 35 ft on arterials',
    maxArea: '100 sq ft (standard)',
    setback: '5 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial districts; prohibited in beach/tourist areas and historic districts.',
    requiredDocs: [
      'City of Fort Lauderdale Building Permit Application',
      'Contractor Registration with City of Fort Lauderdale (required)',
      'Signed and sealed structural drawings',
      'Electrical plans for illuminated signs',
      'Interior signs over 50 sq ft require engineer seal',
      'Manufacturer\'s specifications for cabinets/structures',
      'Site plan with setback dimensions',
      'Landlord/owner authorization letter',
    ],
    redFlags: [
      'Contractor MUST be registered with the City of Fort Lauderdale — state license alone is not enough',
      'Interior illuminated signs over 50 sq ft require a Florida PE seal',
      'Beach Community Overlay District (Las Olas Blvd, A1A) has strict design review — no pole signs',
      'Historic districts require Certificate of Appropriateness before permit',
      'Downtown Development Authority zone has separate design guidelines',
    ],
    contacts: [
      { label: 'Building Services', value: '(954) 828-6520' },
      { label: 'Permit Portal', value: 'fortlauderdale.gov/permits' },
      { label: 'Zoning', value: '(954) 828-4528' },
      { label: 'Contractor Reg.', value: '(954) 828-5000' },
    ],
    fees: 'Base $125 + $3.75/sq ft',
    turnaround: '3–6 weeks',
    practitionerNotes: [
      'The contractor registration step trips up out-of-town companies constantly — do this before you design or quote.',
      'Las Olas Blvd is a de facto channel-letters-only zone in practice; plan accordingly.',
      'The city inspector can reject a sign for aesthetic reasons in overlay zones — get pre-approval from planning.',
    ],
    codeLanguage: [
      {
        section: '§47-22.5',
        title: 'Contractor Registration Requirement',
        verbatim: 'No permit shall be issued for the installation, alteration, or relocation of any sign unless the contractor performing the work holds a current Certificate of Competency issued by the City of Fort Lauderdale Building Services Division, in addition to any state-issued license.',
        simplified: 'Your company must have a City of Fort Lauderdale contractor registration on file — your Florida state license is not enough. Pull this certificate before doing any work in the city.',
      },
      {
        section: '§47-22.3(b)',
        title: 'Interior Signs — Engineer Seal',
        verbatim: 'Interior signs, including illuminated box signs mounted within a tenant space, that exceed fifty (50) square feet in display area shall require drawings signed and sealed by a Florida-licensed Professional Engineer.',
        simplified: 'Even interior lit box signs need a PE seal if they\'re over 50 square feet. This catches a lot of installers off guard on interior retail buildouts.',
      },
      {
        section: '§47-22.8',
        title: 'Beach Community Overlay — Sign Restrictions',
        verbatim: 'Within the Beach Community Overlay District, freestanding pole signs are prohibited. Ground-mounted monument signs shall not exceed six (6) feet in height or thirty-two (32) square feet in display area.',
        simplified: 'In the beach/Las Olas area, no pole signs at all. Monument signs only, maxing out at 6 feet tall and 32 square feet. If your client wants a pole sign near the beach, the answer is no.',
      },
    ],
  },

  // ── POMPANO BEACH ────────────────────────────────────────────────────────
  'pompano-beach': {
    jurisdiction: 'City of Pompano Beach',
    county: 'Broward County',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; Master Sign Program compliance required where applicable.',
    requiredDocs: [
      'Pompano Beach Building Permit Application',
      'Signed/sealed structural and electrical drawings',
      'Site plan with dimensions and setbacks',
      'Master Sign Program compliance documentation (if applicable)',
      'Atlantic Blvd corridor: AAC design review approval required',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Master Sign Program has been MANDATORY for all multi-tenant commercial properties since 2022',
      'Atlantic Boulevard corridor requires Architectural & Appearance Committee (AAC) design review BEFORE permit',
      'New MSP submittal required when adding a sign to a property that doesn\'t have one yet — adds 4–8 weeks',
      'Beach overlay areas have additional height and design restrictions',
    ],
    contacts: [
      { label: 'Building Dept', value: '(954) 786-4601' },
      { label: 'Permit Portal', value: 'pompanobeachfl.gov/permits' },
      { label: 'Planning (AAC)', value: '(954) 786-7814' },
    ],
    fees: 'Base $120 + $3.50/sq ft',
    turnaround: '3–5 weeks (AAC adds 4–6 weeks)',
    practitionerNotes: [
      'If the property doesn\'t have an approved MSP on file, your permit will not move until one is created — budget for this upfront.',
      'The AAC meets monthly; missing the submission deadline means waiting another month.',
      'Atlantic Blvd is the #1 trouble spot. Check with planning before designing anything on that corridor.',
    ],
    codeLanguage: [
      {
        section: '§155.302',
        title: 'Master Sign Program — Required',
        verbatim: 'All multi-tenant commercial, industrial, or mixed-use properties containing two (2) or more tenants shall maintain a current, approved Master Sign Program (MSP) on file with the City. No sign permit shall be issued for any tenant within such a property absent a valid MSP.',
        simplified: 'Any property with two or more tenants must have an approved Master Sign Program. Without it, no individual tenant can get a sign permit. If the property\'s MSP is expired or never existed, that has to be fixed first.',
      },
      {
        section: '§155.308(a)',
        title: 'Atlantic Boulevard Corridor — AAC Review',
        verbatim: 'All new signs or modifications to existing signs located within three hundred (300) feet of Atlantic Boulevard shall be subject to review and approval by the Architectural and Appearance Committee (AAC) prior to the issuance of any building permit.',
        simplified: 'Anything within 300 feet of Atlantic Blvd needs to go through the city\'s design review board (AAC) before you can get a permit. Plan for an extra 4–6 weeks on your timeline for Atlantic Blvd jobs.',
      },
    ],
  },

  // ── BOCA RATON ───────────────────────────────────────────────────────────
  'boca-raton': {
    jurisdiction: 'City of Boca Raton',
    county: 'Palm Beach County',
    maxHeight: '15 ft (standard)',
    maxArea: '64 sq ft (standard)',
    setback: '10 ft from ROW',
    emcAllowed: false,
    emcNotes: 'EMC/digital signs are BANNED throughout the City of Boca Raton. No exceptions.',
    requiredDocs: [
      'City of Boca Raton Sign Permit Application',
      'Architectural review approval from Design Review Board (DRB)',
      'Signed/sealed structural and electrical drawings',
      'Site plan with all setbacks, dimensions, and context',
      'Color renderings required for DRB',
      'Material and finish specifications',
      'Master Sign Program compliance documentation',
      'Contractor license and insurance',
    ],
    redFlags: [
      'STRICTEST sign code in South Florida — budget double the time',
      'EMC/digital signs are COMPLETELY BANNED — do not propose them to clients in Boca',
      'Design Review Board approval required BEFORE permit — adds 6–10 weeks minimum',
      'DRB reviews aesthetics, materials, colors, and proportions — not just dimensions',
      'Standard turnaround is 8–12 weeks minimum; complex projects can hit 16+ weeks',
      'Master Sign Program required for all multi-tenant properties',
      'Non-conforming signs cannot be expanded or altered without full DRB review',
    ],
    contacts: [
      { label: 'Building Dept', value: '(561) 393-7750' },
      { label: 'Design Review Board', value: '(561) 393-7763' },
      { label: 'Permit Portal', value: 'myboca.us/permits' },
    ],
    fees: 'Base $175 + $5/sq ft',
    turnaround: '8–12 weeks (DRB adds 6–10 weeks)',
    practitionerNotes: [
      'Boca is the city where jobs go to die from a timing standpoint. Always warn clients upfront.',
      'DRB meetings are bi-weekly; one missed deadline means 2 more weeks of waiting.',
      'The city will reject signs for being "too bright," wrong color, or wrong proportion — not just for violating measurements.',
      'Never propose an EMC to a Boca client. They are banned, full stop.',
    ],
    codeLanguage: [
      {
        section: '§28-1791',
        title: 'Electronic Message Centers — Prohibited',
        verbatim: 'Electronic message center signs, digital signs, LED signs, and any sign with changeable electronic or digital copy are prohibited throughout all zoning districts within the City of Boca Raton.',
        simplified: 'EMC, digital, and LED message signs are banned city-wide in Boca Raton. This is not a zoning district thing — it applies everywhere in the city. Don\'t even quote a client on a digital sign in Boca.',
      },
      {
        section: '§28-1785(a)',
        title: 'Design Review Board Approval',
        verbatim: 'No permit shall be issued for the erection, alteration, or relocation of any sign requiring a building permit until the applicant has obtained written approval from the Design Review Board. The Board shall evaluate sign proposals for compatibility with the architectural character of the building and surrounding area.',
        simplified: 'You must get the Design Review Board\'s written approval before the building department will even look at your permit application. The DRB judges whether the sign fits in with the building and neighborhood, not just whether it meets the code numbers.',
      },
    ],
  },

  // ── MIAMI BEACH ──────────────────────────────────────────────────────────
  'miami-beach': {
    jurisdiction: 'City of Miami Beach',
    county: 'Miami-Dade County',
    maxHeight: '25 ft (non-historic)',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: false,
    emcNotes: 'No EMC/digital signs anywhere in Miami Beach. Historic district rules are strict.',
    requiredDocs: [
      'City of Miami Beach Building Permit Application',
      'Historic Preservation Board (HPB) approval (if in historic district)',
      'Signed and sealed structural drawings',
      'Electrical plans',
      'Channel letter specifications and layout',
      'Color and material board for HPB review',
      'Site plan with context photos',
      'Owner authorization',
    ],
    redFlags: [
      'No EMC or digital signs anywhere in the city',
      'Historic districts (Art Deco, Flamingo Park, etc.) require Historic Preservation Board approval — adds months',
      'Most of South Beach is in a historic district — assume HPB review is required',
      'Channel letters are the predominant approved sign type in historic zones',
      'Neon is sometimes approved in Art Deco district for historic aesthetic consistency',
      'Any change to a historic building facade requires a Certificate of Appropriateness',
    ],
    contacts: [
      { label: 'Building Dept', value: '(305) 673-7610' },
      { label: 'Historic Preservation', value: '(305) 673-7550' },
      { label: 'Permit Portal', value: 'miamibeachfl.gov/permits' },
    ],
    fees: 'Base $150 + $4.25/sq ft',
    turnaround: '4–8 weeks (HPB adds 6–12 weeks)',
    practitionerNotes: [
      'If the building is in Art Deco district, assume 3–4 months minimum from design to permit.',
      'The HPB is very protective of the historic character — bring high-quality renderings and precedent images.',
      'Simple channel letters in appropriate colors sail through HPB faster than complex cabinets.',
    ],
    codeLanguage: [
      {
        section: '§138-59',
        title: 'Electronic Signs Prohibited',
        verbatim: 'Electronic message center signs, light-emitting diode (LED) signs, digital signs, and any sign capable of displaying variable or changeable electronic messaging are prohibited within all zoning districts of the City of Miami Beach.',
        simplified: 'No digital or LED message signs, anywhere in Miami Beach, in any zone. This is a hard city-wide ban.',
      },
      {
        section: '§118-531',
        title: 'Historic District — Certificate of Appropriateness',
        verbatim: 'Any sign installation, alteration, or removal on a contributing or non-contributing structure within a designated historic district shall require a Certificate of Appropriateness from the Historic Preservation Board prior to the issuance of a building permit.',
        simplified: 'In any Miami Beach historic district, you need the Historic Preservation Board\'s Certificate of Appropriateness before a permit can be issued. This applies to new signs, changed signs, and even removing old signs.',
      },
    ],
  },

  // ── ORLANDO ──────────────────────────────────────────────────────────────
  'orlando': {
    jurisdiction: 'City of Orlando',
    county: 'Orange County',
    maxHeight: '35 ft (standard)',
    maxArea: '150 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted outside Downtown CRA and Appearance Review Board zones; 10-second message hold required.',
    requiredDocs: [
      'City of Orlando Sign Permit Application (Accela portal)',
      'Structural and electrical drawings (PE sealed)',
      'Site plan with dimensions',
      'Downtown CRA: Appearance Review Board (ARB) approval required',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Downtown CRA zone requires Appearance Review Board (ARB) approval before permit',
      'ARB meets monthly — plan for 4–6 week delay on downtown jobs',
      'Church Street entertainment district has separate sign design guidelines',
      'EMC messages must hold for minimum 10 seconds each',
      'Signs within 500 ft of I-4 require additional review',
    ],
    contacts: [
      { label: 'Permit Portal', value: 'permits.cityoforlando.net' },
      { label: 'Building Dept', value: '(407) 246-2271' },
      { label: 'Planning (ARB)', value: '(407) 246-2269' },
    ],
    fees: 'Base $130 + $3.50/sq ft',
    turnaround: '2–4 weeks (ARB adds 4–6 weeks)',
    practitionerNotes: [
      'Downtown Orlando is an ARB zone — factor this into every quote for that area.',
      'Outside downtown, Orlando is relatively straightforward compared to South Florida municipalities.',
      'The Accela online permit portal is reliable and uploads go through cleanly.',
    ],
    codeLanguage: [
      {
        section: '§68.305',
        title: 'Appearance Review Board — Downtown CRA',
        verbatim: 'All signs proposed within the Downtown Community Redevelopment Area boundary shall be reviewed and approved by the Appearance Review Board prior to the issuance of a building permit. The Board shall evaluate compatibility with urban design standards adopted for the CRA.',
        simplified: 'Any sign in the Downtown CRA area needs Appearance Review Board sign-off before you can get a permit. The board checks whether the sign fits the city\'s downtown design vision, not just the code specs.',
      },
      {
        section: '§68.308(c)',
        title: 'Electronic Message Signs — Hold Time',
        verbatim: 'Electronic message signs shall display each advertising message for a minimum period of ten (10) seconds. Animation, scrolling text, and flashing effects are prohibited. Transitions between messages shall not exceed two (2) seconds.',
        simplified: 'Each message on a digital sign must show for 10 full seconds. No animations or scrolling. Quick transitions (under 2 sec) are fine between messages.',
      },
    ],
  },

  // ── TAMPA ────────────────────────────────────────────────────────────────
  'tampa': {
    jurisdiction: 'City of Tampa',
    county: 'Hillsborough County',
    maxHeight: '45 ft (arterial); 25 ft (local)',
    maxArea: '200 sq ft (arterial)',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; prohibited in historic districts; 8-second hold required.',
    requiredDocs: [
      'City of Tampa Building Permit Application (CityView portal)',
      'Signed and sealed structural and electrical drawings',
      'Historic districts: ARC Certificate of Appropriateness required',
      'Site plan with setbacks and ROW dimensions',
      'Photometric study if EMC near residential',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Historic districts (Ybor City, Hyde Park, etc.) require ARC Certificate of Appropriateness',
      'ARC Certificate must be obtained BEFORE building permit application',
      'Ybor City Historic District has extremely specific sign type and material requirements',
      'Signs on arterial roads get larger allowances than local road properties — verify road classification first',
      'Hillsborough County limits are NOT the City of Tampa — verify which jurisdiction the address falls in',
    ],
    contacts: [
      { label: 'Permit Portal', value: 'tampa.gov/permits (CityView)' },
      { label: 'Building Dept', value: '(813) 274-3100' },
      { label: 'ARC/Historic', value: '(813) 274-7714' },
    ],
    fees: 'Base $140 + $4/sq ft',
    turnaround: '3–5 weeks (ARC adds 4–8 weeks)',
    practitionerNotes: [
      'Ybor City is the most restrictive historic district — wooden or hand-painted signs are sometimes the only approved option.',
      'CityView portal is modern and fairly efficient; electronic submittals work well.',
      'Verify the address is Tampa city limits, not unincorporated Hillsborough, before designing to either code.',
    ],
    codeLanguage: [
      {
        section: '§27-282.16',
        title: 'Historic Districts — Certificate of Appropriateness',
        verbatim: 'No building permit shall be issued for any sign located on a property within a locally designated historic district unless the applicant has first obtained a Certificate of Appropriateness from the Architectural Review Commission.',
        simplified: 'Historic districts in Tampa (Ybor City, Hyde Park, etc.) require a Certificate of Appropriateness from the Architectural Review Commission before you can apply for a building permit. Get the ARC approval first, then apply for the permit.',
      },
      {
        section: '§27-282.5(b)',
        title: 'Road Classification — Maximum Height',
        verbatim: 'The maximum height of freestanding signs shall be determined by the functional classification of the adjacent right-of-way as follows: Principal Arterial — 45 feet; Minor Arterial — 35 feet; Collector — 25 feet; Local — 15 feet.',
        simplified: 'How tall your freestanding sign can be depends on the type of road it\'s on. Major highways allow up to 45 feet. Smaller arterials get 35. Collector roads top out at 25 feet. Local streets only get 15 feet.',
      },
    ],
  },

  // ── HILLSBOROUGH COUNTY ──────────────────────────────────────────────────
  'hillsborough': {
    jurisdiction: 'Hillsborough County (Unincorporated)',
    county: 'Hillsborough County',
    maxHeight: '35 ft',
    maxArea: '150 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; 8-second minimum hold; photometric study required within 300 ft of residential.',
    requiredDocs: [
      'Hillsborough County Building Permit Application',
      'Signed and sealed structural drawings',
      'Electrical plans for illuminated signs',
      'Site plan with road classification',
      'Survey or lot dimensions',
      'Photometric study (if EMC near residential)',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Always verify the address is UNINCORPORATED Hillsborough — not Tampa, Plant City, or Temple Terrace city limits',
      'Many addresses in Brandon, Riverview, Valrico, and Wesley Chapel are unincorporated',
      'Photometric study required for EMC signs within 300 ft of residential zoning',
      'Road classification impacts allowable sign size — arterial vs. collector vs. local',
    ],
    contacts: [
      { label: 'Building Services', value: '(813) 272-5600' },
      { label: 'Permit Portal', value: 'hcfl.gov/permits' },
      { label: 'Zoning', value: '(813) 272-5600' },
    ],
    fees: 'Base $125 + $3.50/sq ft',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'Brandon, Riverview, and Valrico are the main unincorporated commercial corridors — most work in the county is here.',
      'The county portal is straightforward; this is one of the easier Florida jurisdictions if you\'re in unincorporated territory.',
    ],
    codeLanguage: [
      {
        section: '§6.06.05',
        title: 'Jurisdiction Verification',
        verbatim: 'These regulations apply only to property located within the unincorporated areas of Hillsborough County. Property located within the corporate limits of the City of Tampa, City of Plant City, or City of Temple Terrace shall be subject to the respective city\'s regulations.',
        simplified: 'Hillsborough County sign rules only apply to unincorporated addresses. If the address is inside Tampa, Plant City, or Temple Terrace city limits, you need to follow that city\'s sign code instead.',
      },
      {
        section: '§6.06.12(d)',
        title: 'EMC Photometric Study',
        verbatim: 'Electronic message center signs proposed within three hundred (300) feet of any residentially zoned parcel shall require a photometric study demonstrating compliance with maximum luminance standards, as measured at the residential property line.',
        simplified: 'If a digital sign is within 300 feet of a neighborhood, you need a photometric study showing the light levels at the property line won\'t exceed the allowed maximum. Budget for this study on most commercial corridor EMC jobs.',
      },
    ],
  },

  // ── HOLLYWOOD ────────────────────────────────────────────────────────────
  'hollywood': {
    jurisdiction: 'City of Hollywood',
    county: 'Broward County',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; no EMC within 150 ft of residential zoning.',
    requiredDocs: [
      'Broward County Uniform Sign Permit Application',
      'Hollywood Building Division submittal via ePermitsOneStop',
      'Signed/sealed structural and electrical drawings',
      'Site plan with setbacks',
      'Sign tag required — must be posted on job site before inspection',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Sign tag must be posted on site BEFORE inspection call — inspector will turn away without it',
      'Submittal is through ePermitsOneStop (Broward County platform) even though it\'s a City of Hollywood permit',
      'Young Circle Arts District has special design requirements — check with planning first',
      'Hollywood Beach overlay zone has separate restrictions',
    ],
    contacts: [
      { label: 'Building Division', value: '(954) 967-4500' },
      { label: 'ePermitsOneStop', value: 'epermitsonestop.com' },
      { label: 'Zoning', value: '(954) 921-3471' },
    ],
    fees: 'Base $115 + $3.25/sq ft',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'The ePermitsOneStop portal is Broward County\'s shared platform — don\'t confuse it with direct city submittals.',
      'Sign tags are non-negotiable in Hollywood; carry them with you to every inspection.',
    ],
    codeLanguage: [
      {
        section: '§211.2(a)',
        title: 'Sign Tag Requirement',
        verbatim: 'No sign for which a permit is required shall be inspected unless the permit sign tag issued by the Building Division is posted in a conspicuous location at the job site at the time of inspection.',
        simplified: 'You need to have the city-issued sign tag physically posted at the job site when the inspector shows up. No tag = no inspection. The inspector will leave and you\'ll have to reschedule.',
      },
      {
        section: '§211.5(c)',
        title: 'Submittal Platform',
        verbatim: 'All sign permit applications within the City of Hollywood shall be submitted through the Broward County ePermitsOneStop electronic permitting platform at epermitsonestop.com.',
        simplified: 'Hollywood uses Broward County\'s shared online permit system (ePermitsOneStop) for all sign permits, even though it\'s a city permit. Go to epermitsonestop.com, not the city website, to submit.',
      },
    ],
  },

  // ── DEERFIELD BEACH ──────────────────────────────────────────────────────
  'deerfield-beach': {
    jurisdiction: 'City of Deerfield Beach',
    county: 'Broward County',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC allowed in commercial zones; 8-second minimum hold.',
    requiredDocs: [
      'Deerfield Beach Sign Permit Application',
      'Owner signature required on ALL permit applications — no exceptions',
      'Signed/sealed structural and electrical drawings',
      'Site plan',
      'Contractor license and insurance',
    ],
    redFlags: [
      'Owner signature required on EVERY permit — tenant signature alone is NOT accepted',
      'Missing owner signature is the #1 rejection reason in Deerfield Beach',
      'Hillsboro Boulevard corridor has additional visibility triangle setback requirements',
      'Beach overlay zone near A1A has stricter height limits (15 ft max)',
    ],
    contacts: [
      { label: 'Building Dept', value: '(954) 480-4280' },
      { label: 'Permit Portal', value: 'deerfield-beach.com/permits' },
    ],
    fees: 'Base $105 + $3/sq ft',
    turnaround: '2–3 weeks',
    practitionerNotes: [
      'Owner signature is the single biggest rejection cause here — always collect it before submitting.',
      'Get the owner\'s signature on the actual city form, not just a letter of authorization.',
      'Relatively fast turnaround once submitted correctly.',
    ],
    codeLanguage: [
      {
        section: '§98-4(b)',
        title: 'Owner Signature — Required on All Permits',
        verbatim: 'All sign permit applications shall be executed by the property owner of record or their legally authorized representative. Tenant authorization alone shall not constitute sufficient authorization for permit issuance. A notarized owner signature is required on the City of Deerfield Beach permit application form.',
        simplified: 'The actual property owner must sign every sign permit application. Tenant signatures, even with written permission from the landlord, are not enough. Get the owner to sign the city\'s actual permit form — a separate letter won\'t substitute.',
      },
    ],
  },

  // ── PEMBROKE PINES ───────────────────────────────────────────────────────
  'pembroke-pines': {
    jurisdiction: 'City of Pembroke Pines',
    county: 'Broward County',
    maxHeight: '20 ft',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones with 8-second message hold.',
    requiredDocs: [
      'Pembroke Pines Sign Permit Application (via CGA Solutions)',
      'Signed/sealed structural drawings',
      'Electrical plans for illuminated signs',
      'Site plan with setbacks',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Building department is managed by CGA Solutions (third-party contractor) — NOT the city directly',
      'Submit permits to CGA Solutions offices/portal, not City Hall',
      'CGA can have different review timelines than municipal departments — call ahead',
      'Pines Boulevard corridor has increased visibility and aesthetic standards',
    ],
    contacts: [
      { label: 'CGA Solutions', value: '(954) 432-8000' },
      { label: 'CGA Portal', value: 'cga-corp.com/pembroke-pines' },
      { label: 'City Zoning', value: '(954) 431-4500' },
    ],
    fees: 'Base $120 + $3.50/sq ft',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'CGA Solutions runs the building department here — don\'t go to City Hall for permits.',
      'CGA is generally efficient but can have backlogs. Call to check queue times before submitting.',
    ],
    codeLanguage: [
      {
        section: '§155-6.2',
        title: 'Building Department — Third-Party Administration',
        verbatim: 'The City of Pembroke Pines has contracted building department services to an approved third-party building services provider. All permit applications, plan review, and inspection scheduling shall be conducted through said provider at their designated office or electronic portal.',
        simplified: 'Pembroke Pines outsources its building department to CGA Solutions. You submit permits to CGA, not the city. Use CGA\'s office or portal for everything — applications, plan review, inspections.',
      },
    ],
  },

  // ── CORAL SPRINGS ────────────────────────────────────────────────────────
  'coral-springs': {
    jurisdiction: 'City of Coral Springs',
    county: 'Broward County',
    maxHeight: '20 ft',
    maxArea: '80 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; strict aesthetic standards enforced during review.',
    requiredDocs: [
      'Coral Springs Sign Permit Application',
      'Signed/sealed structural drawings',
      'Electrical plans',
      'Site plan with dimensions and setbacks',
      'Rendering or photo simulation of installed sign',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Coral Springs has one of the most active code enforcement divisions in Broward',
      'Non-permitted signs are aggressively cited — unpermitted installations lead to stop-work orders and fines',
      'Aesthetic standards are actively enforced — signs that look cheap or mismatched can be flagged',
      'University Drive and Sample Road corridors get extra scrutiny',
      'Rendering or photo simulation often required during plan review',
    ],
    contacts: [
      { label: 'Building Dept', value: '(954) 344-1130' },
      { label: 'Permit Portal', value: 'coralsprings.org/permits' },
      { label: 'Code Enforcement', value: '(954) 344-1840' },
    ],
    fees: 'Base $115 + $3.25/sq ft',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'Don\'t start work before the permit is in hand in Coral Springs — code enforcement will find it fast.',
      'Submit a clean, professional rendering with your application to avoid aesthetic comments that slow review.',
    ],
    codeLanguage: [
      {
        section: '§10-94(a)',
        title: 'Aesthetic Standards — Enforcement',
        verbatim: 'Signs shall be compatible in design, proportion, style, and quality with the principal structure to which they are attached or relate. The Building Official may require the applicant to submit renderings, material samples, or color specifications to evaluate aesthetic compatibility.',
        simplified: 'Signs must look appropriate next to the building they\'re on. Coral Springs can require you to submit renderings and material samples during plan review to make sure the sign looks good, not just meets the measurements.',
      },
    ],
  },

  // ── MIRAMAR ──────────────────────────────────────────────────────────────
  'miramar': {
    jurisdiction: 'City of Miramar',
    county: 'Broward County',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial and industrial zones.',
    requiredDocs: [
      'Miramar Sign Permit Application',
      'Signed/sealed structural and electrical drawings',
      'Site plan',
      'Miramar Parkway Business Park District: design review required',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Large business park district along Miramar Parkway has its own sign design standards',
      'Business park zone requires design review through Planning & Zoning before permit',
      'Miramar Parkway corridor is industrial/office — standard commercial rules may not apply',
      'Check zoning designation carefully — mixed-use and CRA zones have separate rules',
    ],
    contacts: [
      { label: 'Building Dept', value: '(954) 602-3000' },
      { label: 'Permit Portal', value: 'miramarfl.gov/permits' },
      { label: 'Planning & Zoning', value: '(954) 602-3264' },
    ],
    fees: 'Base $115 + $3.25/sq ft',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'Most Miramar sign work is in the Miramar Parkway business park — know those rules cold.',
      'The city\'s planning department is responsive; a quick call can save a rejection.',
    ],
    codeLanguage: [
      {
        section: '§150-301',
        title: 'Business Park District — Design Review',
        verbatim: 'Signs located within the Miramar Parkway Business Park District shall be subject to design review by the Planning and Zoning Division to ensure conformance with the adopted Business Park Design Standards. No sign permit shall be issued for properties within this district without planning approval.',
        simplified: 'Signs in the Miramar Parkway business park area go through an extra planning review step before permits are issued. The city has design standards for that district and will check your sign against them.',
      },
    ],
  },

  // ── WEST PALM BEACH ──────────────────────────────────────────────────────
  'west-palm-beach': {
    jurisdiction: 'City of West Palm Beach',
    county: 'Palm Beach County',
    maxHeight: '25 ft (standard)',
    maxArea: '100 sq ft',
    setback: '5 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted outside Downtown CRA; prohibited in historic districts.',
    requiredDocs: [
      'City of West Palm Beach Sign Permit Application',
      'Downtown CRA: Development Review Committee (DRC) approval required',
      'Historic districts: Historic Preservation Board approval required',
      'Signed/sealed structural and electrical drawings',
      'Site plan with dimensions',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'This is the CITY — NOT Palm Beach County (separate jurisdiction, separate rules)',
      'Downtown CRA zone requires Development Review Committee (DRC) approval before permit',
      'Flamingo Park and El Cid historic districts require Historic Preservation Board approval',
      'ClematiStreet entertainment district has additional design guidelines',
      'No EMC signs in historic districts',
    ],
    contacts: [
      { label: 'Building Dept', value: '(561) 822-1477' },
      { label: 'Permit Portal', value: 'wpb.org/permits' },
      { label: 'Downtown Dev Authority', value: '(561) 833-8873' },
      { label: 'Historic Preservation', value: '(561) 822-1441' },
    ],
    fees: 'Base $130 + $3.75/sq ft',
    turnaround: '3–5 weeks (DRC/HPB adds 4–8 weeks)',
    practitionerNotes: [
      'West Palm Beach City ≠ Palm Beach County. Different portal, different rules, different contacts.',
      'Downtown projects almost always need DRC review — budget for it.',
    ],
    codeLanguage: [
      {
        section: '§94-482',
        title: 'Downtown CRA — Development Review',
        verbatim: 'All signs proposed within the Downtown West Palm Beach Community Redevelopment Area shall require review and approval by the Development Review Committee prior to the issuance of any sign permit. The DRC shall evaluate compliance with the Downtown Master Plan and adopted design standards.',
        simplified: 'Downtown West Palm Beach has an extra review step: the Development Review Committee must approve your sign before the building department issues a permit. The DRC checks whether the sign fits the Downtown Master Plan.',
      },
    ],
  },

  // ── DELRAY BEACH ─────────────────────────────────────────────────────────
  'delray-beach': {
    jurisdiction: 'City of Delray Beach',
    county: 'Palm Beach County',
    maxHeight: '20 ft',
    maxArea: '64 sq ft',
    setback: '10 ft from ROW',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; prohibited on Atlantic Avenue corridor and in historic districts.',
    requiredDocs: [
      'City of Delray Beach Sign Permit Application (ePlans — fully digital)',
      'Qualifier must sign AND notarize the application',
      'Separate permit required per individual sign',
      'Signed/sealed structural drawings',
      'Electrical plans',
      'Site plan',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'SEPARATE PERMIT required for EACH individual sign — no combining on one application',
      'Qualifier (contractor) must personally sign AND NOTARIZE the permit application',
      'Triple fees for unpermitted signs found by code enforcement',
      'Atlantic Avenue (A1A corridor) prohibits EMC and has strict design standards',
      'Delray Beach Historic District requires Certificate of Appropriateness',
      'Fully digital submittal through ePlans — no paper accepted',
    ],
    contacts: [
      { label: 'Building Dept', value: '(561) 243-7200' },
      { label: 'ePlans Portal', value: 'eplans.delraybeach.com' },
      { label: 'Historic Preservation', value: '(561) 243-7040' },
    ],
    fees: 'Base $120 + $4/sq ft (triple for unpermitted)',
    turnaround: '2–4 weeks',
    practitionerNotes: [
      'Notarized qualifier signature is unusual — have a notary lined up or use an online notary service.',
      'One permit per sign is tedious on multi-sign jobs but the city is strict about it.',
      'ePlans works well once you\'re set up — fully digital and reasonably fast.',
      'Never install without a permit in Delray; the triple fee penalty is real.',
    ],
    codeLanguage: [
      {
        section: '§4.6.7(C)',
        title: 'One Permit Per Sign',
        verbatim: 'Each sign for which a permit is required shall be the subject of a separate permit application. Permits shall not be combined across multiple signs. Each permit shall describe a single sign by type, dimensions, and location.',
        simplified: 'Every sign gets its own separate permit application in Delray Beach. You cannot lump multiple signs into one permit. If you\'re installing four signs for a tenant, you\'re pulling four permits.',
      },
      {
        section: '§4.6.7(B)(1)',
        title: 'Notarized Qualifier Signature',
        verbatim: 'Each sign permit application shall be executed by the licensed contractor of record (qualifier) and such signature shall be notarized. A notarized owner or tenant authorization form shall also be submitted concurrently.',
        simplified: 'The licensed contractor pulling the permit must sign the application AND get it notarized. Additionally, you need a notarized authorization from the property owner or tenant. Two notarized documents minimum on every Delray Beach sign permit.',
      },
      {
        section: '§4.6.7(G)',
        title: 'Unpermitted Sign Penalty',
        verbatim: 'Any person who erects, installs, or maintains a sign requiring a permit without having obtained such permit shall be subject to a fee equal to three (3) times the standard permit fee, in addition to any code enforcement fines and penalties.',
        simplified: 'If code enforcement catches an unpermitted sign, the permit fee triples. That\'s on top of any code enforcement fines. In Delray Beach, there is no cheap way out of an unpermitted sign — permit it properly the first time.',
      },
    ],
  },

  // ── SUNRISE ──────────────────────────────────────────────────────────────
  'sunrise': {
    jurisdiction: 'City of Sunrise',
    county: 'Broward County',
    maxHeight: '25 ft',
    maxArea: '100 sq ft',
    setback: '5 ft from property line',
    emcAllowed: true,
    emcNotes: 'EMC permitted in commercial zones; Sawgrass Mills area has master sign program restrictions.',
    requiredDocs: [
      'Sunrise Sign Permit Application',
      'Signed/sealed structural and electrical drawings',
      'Site plan with setbacks',
      'Sawgrass Mills area: Master Sign Program compliance required',
      'Contractor license and insurance',
      'Owner authorization',
    ],
    redFlags: [
      'Sawgrass Mills mall area has a Master Sign Program that governs ALL signage on mall property',
      'Mall tenants must comply with Sawgrass Mills MSP requirements, NOT standard city code',
      'MSP must be approved by city planning before any individual tenant permit is issued',
      'Commercial Boulevard corridor has visibility standards that differ from other corridors',
      'Sunrise is bordered by Plantation and Tamarac — verify the address jurisdiction carefully',
    ],
    contacts: [
      { label: 'Building Dept', value: '(954) 746-3210' },
      { label: 'Permit Portal', value: 'sunrisefl.gov/permits' },
      { label: 'Planning & Zoning', value: '(954) 746-3240' },
    ],
    fees: 'Base $115 + $3.25/sq ft',
    turnaround: '2–3 weeks',
    practitionerNotes: [
      'Sawgrass Mills is its own world — every sign goes through the MSP process before city permit.',
      'The mall\'s own sign criteria kit governs letter heights, materials, and illumination levels.',
      'For non-mall Sunrise jobs, the process is relatively smooth.',
    ],
    codeLanguage: [
      {
        section: '§155-421',
        title: 'Sawgrass Mills — Master Sign Program',
        verbatim: 'Signage on properties within the Sawgrass Mills Mall Planned Unit Development shall be governed by the approved Master Sign Program for that development. Individual tenant sign permits shall not be issued unless the proposed sign is in conformance with the current approved Master Sign Program.',
        simplified: 'If the sign is at Sawgrass Mills, the mall\'s Master Sign Program runs the show. Every tenant sign has to match what the MSP says about letter height, illumination, materials, and placement before the city will issue any permit.',
      },
    ],
  },
};

// ── Helper: fetch URL context ──────────────────────────────────────────────
async function fetchSource(url: string): Promise<string> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return '';
    const text = await res.text();
    return text.slice(0, 3000);
  } catch {
    return '';
  }
}

// ── Route handler ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jurisdictionKey = searchParams.get('jurisdiction')?.toLowerCase().trim() ?? '';

  if (!jurisdictionKey) {
    return NextResponse.json({ error: 'Jurisdiction parameter is required.' }, { status: 400 });
  }

  const data = JURISDICTIONS[jurisdictionKey];
  if (!data) {
    return NextResponse.json({ error: `Jurisdiction "${jurisdictionKey}" not found.` }, { status: 404 });
  }

  // Try to enrich with AI formatting
  try {
    const prompt = `You are a sign permit expert. Format this jurisdiction data into a clear, useful summary for a sign installer. Keep it concise and practical. Data: ${JSON.stringify(data)}`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    // Return raw data (AI formatting is supplemental — we return the structured data directly)
    return NextResponse.json(data);
  } catch {
    // Fall back to raw data if AI call fails
    return NextResponse.json(data);
  }
}
