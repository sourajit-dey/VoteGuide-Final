/**
 * @file data.js
 * @description All election content as structured data.
 *              Frozen with Object.freeze() for immutability.
 *              Single source of truth for all content.
 * @author VoteGuide India
 * @version 1.0.0
 */

const ELECTION_DATA = Object.freeze({

  timelineStages: [
    {
      id: 1, stage: 1,
      title: 'Announcement',
      subtitle: 'Election Commission declares the schedule',
      duration: 'Day 0',
      icon: '📢',
      details: [
        'Election Commission of India (ECI) announces the full election schedule',
        'Model Code of Conduct (MCC) comes into effect immediately upon announcement',
        'ECI appoints Observer teams for every constituency',
        'All polling staff are put on election duty from this date',
        'Political parties must comply with MCC from this moment onwards',
        'Government cannot announce new schemes or make policy changes that benefit voters'
      ],
      funFact: 'The MCC has no statutory backing but is enforced by the moral authority of the Election Commission. No court has ever struck it down.'
    },
    {
      id: 2, stage: 2,
      title: 'Nomination',
      subtitle: 'Candidates file their candidature papers',
      duration: '7-14 days',
      icon: '📋',
      details: [
        'Candidates file Form 2B (nomination paper) with the Returning Officer',
        'Must submit Form 26 — an affidavit declaring criminal record, assets, and education',
        'Security deposit: Rs 25,000 for general candidates, Rs 12,500 for SC/ST candidates',
        'Nomination papers available at the District Collector office',
        'A candidate can file up to 4 nomination papers for the same seat',
        'Proposers required: 1 proposer from the constituency for recognized party candidates'
      ],
      funFact: 'The security deposit is forfeited if the candidate fails to secure more than 1/6th of total valid votes polled in the constituency.'
    },
    {
      id: 3, stage: 3,
      title: 'Scrutiny',
      subtitle: 'Returning Officer examines all nominations',
      duration: '1 day',
      icon: '🔍',
      details: [
        'Returning Officer (RO) examines all nomination papers for completeness',
        'RO can reject nominations that are incomplete or improperly filed',
        'Candidates and their agents can attend and raise objections',
        'Rejected candidates can appeal to the High Court',
        'Valid candidates list is published after scrutiny',
        'Scrutiny happens on a single designated day in the election schedule'
      ],
      funFact: 'In the 2024 General Elections, thousands of nomination papers were filed across 543 constituencies over 7 phases — each scrutinized individually.'
    },
    {
      id: 4, stage: 4,
      title: 'Withdrawal',
      subtitle: 'Candidates can withdraw within 2 days',
      duration: '2 days',
      icon: '↩️',
      details: [
        'Candidates have 2 days after scrutiny to withdraw their nominations',
        'Withdrawal must be done in writing to the Returning Officer personally',
        'Once withdrawn, the decision cannot be reversed',
        'Final list of contesting candidates published after withdrawal deadline',
        'EVM programming begins with the finalized candidate list',
        'Election symbols assigned to candidates — national parties get reserved symbols'
      ],
      funFact: 'After the withdrawal deadline, even the death of a candidate does not automatically cancel the election in that constituency.'
    },
    {
      id: 5, stage: 5,
      title: 'Campaign',
      subtitle: 'Candidates campaign across the constituency',
      duration: 'Until 48hrs before polling',
      icon: '📣',
      details: [
        'Candidates campaign through public rallies, door-to-door visits, media ads',
        'Spending limit: Rs 95 lakh per candidate in large states (Lok Sabha)',
        'MCC prohibits: hate speech, vote buying, misuse of government resources',
        'All campaign materials must display printer name and address',
        'Silent period: all campaigning must stop 48 hours before polling begins',
        'During silent period: no public meetings, no door-to-door visits, no media ads'
      ],
      funFact: 'The 48-hour silent period before polling was introduced to give voters time to make decisions free from last-minute campaign pressure.'
    },
    {
      id: 6, stage: 6,
      title: 'Polling Day',
      subtitle: 'Citizens exercise their right to vote',
      duration: '7 AM to 6 PM',
      icon: '🗳️',
      details: [
        'Polling booths open at 7:00 AM and close at 6:00 PM (timings may vary)',
        'Voter must carry EPIC card or any of 12 approved alternative photo IDs',
        'Indelible ink is applied to the left index finger to prevent double voting',
        'Voter presses the button next to their chosen candidate on the EVM Ballot Unit',
        'VVPAT prints a paper slip showing candidate name and symbol — visible 7 seconds',
        'NOTA (None of the Above) is available as the last option — Option 99',
        'No polling booth can be more than 2 km from any voter in the constituency'
      ],
      funFact: 'India uses around 5 million EVMs across 1 million polling stations — making it the largest use of electronic voting anywhere in the world.'
    },
    {
      id: 7, stage: 7,
      title: 'Counting and Results',
      subtitle: 'Votes counted and winner declared',
      duration: 'Counting Day',
      icon: '📊',
      details: [
        'Counting takes place at designated Counting Centers — usually a large hall',
        'Postal ballots (from armed forces, elderly, disabled) are counted first',
        'EVM Control Units are opened round by round and votes are tallied',
        'Returning Officer announces the result round by round',
        'The candidate with the highest valid votes wins — FPTP (First Past The Post)',
        'Winner receives a formal certificate of election from the Returning Officer',
        'A party needs 272 of 543 seats for a simple majority in Lok Sabha',
        'President invites majority party leader to form the government'
      ],
      funFact: 'In 2024, counting for all 543 constituencies happened simultaneously on June 4th — with results declared within hours due to EVM efficiency.'
    }
  ],

  glossaryTerms: [
    {
      term: 'ECI',
      definition: 'The Election Commission of India is a constitutional body established under Article 324. It has three members: the Chief Election Commissioner and two Election Commissioners. It is completely independent of the government and has supreme authority over all elections in India.',
      source: 'Constitution of India, Article 324'
    },
    {
      term: 'MCC',
      definition: 'The Model Code of Conduct is a set of guidelines issued by ECI governing political parties and candidates from the election schedule announcement until result declaration. It has no statutory law behind it but is enforced through ECI authority and has been universally followed since 1971.',
      source: 'Election Commission of India'
    },
    {
      term: 'EVM',
      definition: 'An Electronic Voting Machine consists of two units: the Ballot Unit (placed in the voting compartment where the voter presses the button) and the Control Unit (with the Presiding Officer). A single EVM can record up to 2,000 votes. EVMs are sealed, standalone machines with no network connectivity.',
      source: 'Representation of the People Act, 1951'
    },
    {
      term: 'VVPAT',
      definition: 'Voter Verifiable Paper Audit Trail is a printer device attached to the EVM. After pressing the vote button, the VVPAT prints a paper slip showing the candidate name, serial number, and election symbol. The slip is visible through a transparent window for exactly 7 seconds before dropping into a sealed box. The voter cannot take this slip.',
      source: 'Conduct of Elections Rules, 1961'
    },
    {
      term: 'NOTA',
      definition: 'None of the Above is the last option on every EVM ballot. It was introduced following the Supreme Court order in PUCL v. Union of India (2013). If a voter does not wish to vote for any candidate, they can press NOTA. NOTA votes are counted but do not cause a re-election — the candidate with the highest valid votes still wins.',
      source: 'Supreme Court — PUCL v. Union of India, 2013'
    },
    {
      term: 'Returning Officer',
      definition: 'A District Magistrate or equivalent senior government officer appointed by ECI for each constituency. The Returning Officer is responsible for accepting nomination papers, conducting scrutiny, overseeing the polling process, and formally declaring the election result.',
      source: 'Representation of the People Act, 1951'
    },
    {
      term: 'Presiding Officer',
      definition: 'The government official placed in charge of a single polling station on election day. Responsible for orderly conduct of voting, operating the EVM Control Unit, ensuring no one votes twice, and preparing all polling station records at the end of the day.',
      source: 'Conduct of Elections Rules, 1961'
    },
    {
      term: 'EPIC',
      definition: 'Electors Photo Identity Card is the official Voter ID card issued by ECI. It is the primary document for voting. However, ECI accepts 12 alternative photo IDs: Aadhaar, MNREGA job card, bank/post-office passbook with photo, health insurance smart card, driving licence, Indian passport, PAN card, NPR smart card, pension documents with photo, and disability certificate.',
      source: 'Election Commission of India'
    },
    {
      term: 'Lok Sabha',
      definition: 'The House of the People — the lower house of the Indian Parliament. Has 543 directly elected seats representing 543 constituencies across India. Members serve a 5-year term. The party or coalition commanding a majority of 272 or more seats forms the government. The Lok Sabha can be dissolved before 5 years by the President on the advice of the Prime Minister.',
      source: 'Constitution of India, Article 81'
    },
    {
      term: 'Constituency',
      definition: 'A geographical area from which one Member of Parliament (MP) is elected to the Lok Sabha. India has 543 Lok Sabha constituencies. Boundaries are drawn by the Delimitation Commission, a body set up by Parliament. Each constituency has roughly equal population as determined by the census.',
      source: 'Delimitation Commission of India'
    },
    {
      term: 'Reserved Seats',
      definition: 'Out of 543 Lok Sabha seats, 84 are reserved for Scheduled Castes (SC) and 47 for Scheduled Tribes (ST) — totaling 131 reserved seats. Only candidates belonging to those communities can contest from reserved constituencies, but all voters in that constituency can vote regardless of their community.',
      source: 'Constitution of India, Articles 330-332'
    },
    {
      term: 'Postal Ballot',
      definition: 'A facility allowing specific voter categories to vote by mail without visiting a polling booth. Available to: members of the armed forces, police officers on election duty outside their constituency, government employees on election duty, voters above 85 years, persons with disabilities, and COVID patients (added recently). Not available for general voters currently.',
      source: 'Conduct of Elections Rules, 1961'
    },
    {
      term: 'cVIGIL',
      definition: 'An application launched by ECI allowing citizens to report electoral code violations during elections — such as distribution of money, liquor, or gifts. Reports include photo or video evidence with GPS location attached automatically. ECI guarantees field response within 100 minutes of any valid complaint.',
      source: 'Election Commission of India'
    },
    {
      term: 'Voter Helpline 1950',
      definition: 'A national toll-free number (1950) for all election-related queries. Helps with: checking voter registration status, finding your polling booth address, registering a complaint, knowing the election schedule, and getting information about the registration process. Available 24x7 during election periods.',
      source: 'Election Commission of India'
    }
  ],

  faqItems: [
    {
      question: 'What ID should I carry to vote?',
      answer: 'Your EPIC (Voter ID card) is the primary document. However, ECI accepts 12 alternatives: Aadhaar card, MNREGA job card, bank or post office passbook with photo, health insurance smart card from Ministry of Labour, driving licence, Indian passport, PAN card, NPR smart card, pension documents with photo, official identity card from Central/State Govt or PSU, and disability certificate. Carry at least one of these.'
    },
    {
      question: 'My name is not on the voter list — can I still vote?',
      answer: 'No. You must be on the electoral roll of that constituency to vote. Check your name at electoralsearch.eci.gov.in or call 1950 before election day. If not enrolled, register immediately using Form 6 at voters.eci.gov.in. Your registration will be included in the next quarterly update (January 1, April 1, July 1, or October 1).'
    },
    {
      question: 'Can I vote if I am away from my registered constituency?',
      answer: 'No — general voters must vote at their registered polling booth only. India does not yet have remote voting for general voters. However, armed forces personnel, police officers on election duty, government employees on election duty, voters above 85 years, and persons with disabilities can use the Postal Ballot facility to vote from their current location.'
    },
    {
      question: 'What is the difference between Lok Sabha and Rajya Sabha?',
      answer: 'Lok Sabha (House of the People): 543 directly elected MPs, maximum 5-year term, decides which party forms the government. Rajya Sabha (Council of States): 245 members elected indirectly by state legislative assemblies, 6-year staggered terms, permanent body (never dissolved). Both houses must pass a bill for it to become law. Only Lok Sabha decides who becomes Prime Minister.'
    },
    {
      question: 'How is the Prime Minister chosen?',
      answer: 'After Lok Sabha election results, the President invites the leader of the party or coalition that commands a majority of 272 or more seats to form the government. That leader is sworn in as Prime Minister. If no party has a clear majority, coalition negotiations happen first. The PM must maintain majority support in Lok Sabha to continue in office.'
    },
    {
      question: 'Can a 17-year-old register to vote?',
      answer: 'Yes. Since 2023, citizens aged 17 can apply in advance for voter registration. The registration becomes active when they turn 18. Apply using Form 6 at voters.eci.gov.in with proof of date of birth showing you will turn 18 by the next qualifying cut-off date (January 1, April 1, July 1, or October 1 of the election year).'
    },
    {
      question: 'Can a convicted person vote or contest elections?',
      answer: 'A person serving a prison sentence of 2 or more years cannot vote while imprisoned. For contesting: anyone convicted with a sentence of 2 or more years is disqualified from contesting elections for 6 years after completing the sentence, under Section 8 of the Representation of the People Act, 1951. Acquitted persons have no restriction.'
    },
    {
      question: 'Can NRIs vote in Indian elections?',
      answer: 'Yes, NRIs who are Indian citizens can register to vote using Form 6A on the NVSP portal (nvsp.in). However, as of current law, NRIs must vote IN PERSON at their registered constituency in India — they cannot vote by postal ballot or proxy. Their registered address in India determines which constituency they vote in.'
    }
  ],

  registrationSteps: {
    newVoter: [
      {
        stepNumber: 1,
        title: 'Check your eligibility',
        description: 'You must be an Indian citizen aged 18 or above (17 if applying in advance) with a residential address in India.',
        tip: 'If you are 17, you can apply now — your registration activates on your 18th birthday'
      },
      {
        stepNumber: 2,
        title: 'Go to the official portal',
        description: 'Visit voters.eci.gov.in on your browser or download the "Voter Helpline" app from Play Store or App Store.',
        tip: 'The official URL is voters.eci.gov.in — do not use any other website'
      },
      {
        stepNumber: 3,
        title: 'Fill Form 6',
        description: 'Click "New Registration" and fill Form 6. Required: your full name, date of birth, residential address, and a recent passport-size photo.',
        tip: 'Your address must match your address proof document exactly'
      },
      {
        stepNumber: 4,
        title: 'Upload documents',
        description: 'Upload: (1) Date of birth proof — Aadhaar, birth certificate, or school leaving certificate. (2) Address proof — Aadhaar, utility bill, or bank passbook. (3) Recent passport photo.',
        tip: 'Documents must be clear and legible — blurry uploads will be rejected'
      },
      {
        stepNumber: 5,
        title: 'Submit and track',
        description: 'Submit the form online. You will receive an application reference number by SMS. Track your application status at electoralsearch.eci.gov.in.',
        tip: 'Your Booth Level Officer (BLO) may visit to verify your address — be available'
      },
      {
        stepNumber: 6,
        title: 'Receive your EPIC card',
        description: 'After approval, your EPIC (Voter ID) card is delivered to your address within 30 days. You can also download the e-EPIC (digital voter ID) from the portal immediately after approval.',
        tip: 'Download the e-EPIC from voters.eci.gov.in — it is valid for all official purposes'
      }
    ],
    overseasVoter: [
      {
        stepNumber: 1,
        title: 'Check NRI eligibility',
        description: 'You must be an Indian citizen currently residing outside India. You must have a valid Indian passport and a current visa or residence permit for your country of residence.',
        tip: 'OCI/PIO cardholders cannot register — only Indian passport holders'
      },
      {
        stepNumber: 2,
        title: 'Fill Form 6A online',
        description: 'Visit nvsp.in or voters.eci.gov.in and fill Form 6A for overseas voters. Upload your Indian passport (relevant pages) and proof of your overseas address.',
        tip: 'Your registration goes to the constituency of your last permanent Indian address'
      },
      {
        stepNumber: 3,
        title: 'Important — voting in person required',
        description: 'NRIs MUST travel to India and vote in person at their registered polling booth. As of current law, NRIs cannot vote by postal ballot or proxy from abroad.',
        tip: 'Plan your travel to India during polling day if you want to exercise your vote'
      }
    ],
    corrections: [
      {
        stepNumber: 1,
        title: 'Change of address',
        description: 'If you have moved to a new address within the same constituency or to a different constituency, fill Form 8 at voters.eci.gov.in. Upload your new address proof.',
        tip: 'Moving to a new constituency requires you to re-register — your old entry will be deleted'
      },
      {
        stepNumber: 2,
        title: 'Name correction or other details',
        description: 'For corrections to your name, photo, date of birth, or other details, fill Form 8 with the correct information and supporting documents.',
        tip: 'Minor name spelling corrections are faster — major changes may require more documents'
      },
      {
        stepNumber: 3,
        title: 'Delete duplicate entry',
        description: 'If your name appears twice in the electoral roll (common after address change), fill Form 7 to request deletion of the incorrect entry.',
        tip: 'Duplicate entries can cause problems on election day — fix them early'
      }
    ]
  },

  eligibilityRules: {
    minAge: 18,
    advanceApplicationAge: 17,
    disqualifications: [
      'Currently serving a prison sentence of 2 or more years',
      'Declared of unsound mind by a competent court',
      'Convicted under specified offences in RPA 1951',
      'Not a citizen of India'
    ],
    requiredIDs: [
      'EPIC (Voter ID Card)',
      'Aadhaar Card',
      'Indian Passport',
      'Driving Licence',
      'PAN Card',
      'MNREGA Job Card',
      'Bank/Post Office Passbook with Photo',
      'Health Insurance Smart Card',
      'Pension Documents with Photo',
      'Disability Certificate with Photo',
      'NPR Smart Card',
      'Official Identity Card from Central/State Govt'
    ]
  }
});
