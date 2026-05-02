export interface IssueComparison {
  category: string;
  partyA: {
    name: string;
    stance: string;
    source: string;
  };
  partyB: {
    name: string;
    stance: string;
    source: string;
  };
}

export interface CandidateBackground {
  name: string;
  party: string;
  education: string;
  experience: string;
  criminalCases: number;
  assets: string;
  photo?: string;
}

export interface StateComparisonData {
  issues: IssueComparison[];
  candidates: CandidateBackground[];
}

export const ISSUE_CATEGORIES = [
  "Agriculture",
  "Healthcare",
  "Education",
  "Infrastructure",
  "Employment",
  "Environment"
];

const DEFAULT_ISSUES: IssueComparison[] = [
  {
    category: "Agriculture",
    partyA: { name: "Ruling Alliance", stance: "Promising 100% MSP on all crops and interest-free loans up to 5 Lakhs.", source: "Manifesto, Page 12" },
    partyB: { name: "Main Opposition", stance: "Focusing on cold-storage infrastructure and direct-to-market digital platforms for farmers.", source: "Vision Document, Page 4" }
  },
  {
    category: "Healthcare",
    partyA: { name: "Ruling Alliance", stance: "Building 500 new community health centers and expanding universal health insurance coverage.", source: "Healthcare Policy, Page 8" },
    partyB: { name: "Main Opposition", stance: "Digitizing all health records and setting up specialized oncology units in every district.", source: "Manifesto, Page 22" }
  },
  {
    category: "Education",
    partyA: { name: "Ruling Alliance", stance: "Increasing education budget to 6% of GDP and providing free tablets to all students.", source: "Education Roadmap, Page 15" },
    partyB: { name: "Main Opposition", stance: "Setting up world-class skill development centers in every block.", source: "Youth Vision, Page 10" }
  },
  {
    category: "Employment",
    partyA: { name: "Ruling Alliance", stance: "Guaranteed unemployment allowance and filling all 10 lakh government vacancies.", source: "Job Guarantee Plan, Page 3" },
    partyB: { name: "Main Opposition", stance: "Incentivizing MSMEs to create 2 crore private-sector jobs over 5 years.", source: "Economic Growth Paper, Page 11" }
  }
];

const generateDefaultState = (
  cmName: string, cmParty: string, cmEdu: string, cmExp: string, cmAssets: string,
  oppName: string, oppParty: string, oppEdu: string, oppExp: string, oppAssets: string
): StateComparisonData => ({
  issues: DEFAULT_ISSUES,
  candidates: [
    { name: cmName, party: cmParty, education: cmEdu, experience: cmExp, criminalCases: 0, assets: cmAssets },
    { name: oppName, party: oppParty, education: oppEdu, experience: oppExp, criminalCases: 0, assets: oppAssets }
  ]
});

export const COMPARISON_DATA: Record<string, StateComparisonData> = {
  "Default": {
    issues: DEFAULT_ISSUES,
    candidates: [
      { name: "Incumbent Leader", party: "Ruling Party", education: "Post Graduate", experience: "20+ Years in Politics", criminalCases: 0, assets: "₹5.5 Crores" },
      { name: "Opposition Challenger", party: "Main Opposition", education: "Graduate", experience: "15+ Years in Service", criminalCases: 0, assets: "₹4.2 Crores" }
    ]
  },
  "Uttar Pradesh": {
    issues: [
      {
        category: "Infrastructure",
        partyA: { name: "BJP", stance: "Completion of Ganga Expressway and 5 new international airports by 2027.", source: "UP Vision 2027, Page 14" },
        partyB: { name: "SP", stance: "Revival of cycle tracks and focus on rural connecting roads with 'Samajwadi' canteens.", source: "Jan Manifesto, Page 9" }
      },
      {
        category: "Education",
        partyA: { name: "BJP", stance: "Setting up Abhyuday free coaching centers in every district and 10 new state universities.", source: "Sankalp Patra, Page 22" },
        partyB: { name: "SP", stance: "Free laptops for all 12th pass students and restoration of student unions.", source: "Progressive Agenda, Page 5" }
      }
    ],
    candidates: [
      { name: "Yogi Adityanath", party: "BJP", education: "B.Sc. in Mathematics", experience: "Incumbent CM, 5-term MP", criminalCases: 0, assets: "₹1.5 Crores" },
      { name: "Akhilesh Yadav", party: "SP", education: "M.S. in Environmental Engg", experience: "Former CM, Leader of Opposition", criminalCases: 0, assets: "₹40.1 Crores" }
    ]
  },
  "Maharashtra": {
    issues: [
      {
        category: "Infrastructure",
        partyA: { name: "Mahayuti", stance: "Expansion of Metro networks in Pune and Nagpur; completion of Coastal Road.", source: "Infrastructure Plan, Page 5" },
        partyB: { name: "MVA", stance: "Focus on rural road connectivity and improving public bus transport (MSRTC) frequency.", source: "Development Agenda, Page 14" }
      },
      {
        category: "Agriculture",
        partyA: { name: "Mahayuti", stance: "Drip irrigation subsidies up to 80% and new solar-pump distribution scheme.", source: "Farmer First, Page 2" },
        partyB: { name: "MVA", stance: "Complete farm loan waiver for loans up to 3 Lakhs and increased crop insurance payouts.", source: "Rural Revival, Page 7" }
      }
    ],
    candidates: [
      { name: "Devendra Fadnavis", party: "BJP (Mahayuti)", education: "Graduate in Law", experience: "Incumbent CM, 25+ Years in Politics", criminalCases: 0, assets: "₹5.1 Crores" },
      { name: "Uddhav Thackeray", party: "Shiv Sena (UBT)", education: "Graduate in Fine Arts", experience: "Former CM, 20+ Years in Leadership", criminalCases: 0, assets: "₹14.5 Crores" }
    ]
  },
  "West Bengal": {
    issues: [
      {
        category: "Employment",
        partyA: { name: "TMC", stance: "Expansion of 'Karmasree' scheme ensuring 50 days of work for all job card holders.", source: "Ma Mati Manush, Page 12" },
        partyB: { name: "BJP", stance: "Establishment of SEZs in North Bengal and 'Sonar Bangla' industrial corridor.", source: "Development Vision, Page 4" }
      },
      {
        category: "Healthcare",
        partyA: { name: "TMC", stance: "Universal health coverage under 'Swasthya Sathi' with cashless treatment up to 5 Lakhs.", source: "Health Report, Page 8" },
        partyB: { name: "BJP", stance: "Implementation of Ayushman Bharat (PM-JAY) across the state for the first time.", source: "Central Schemes, Page 19" }
      }
    ],
    candidates: [
      { name: "Mamata Banerjee", party: "TMC", education: "MA, B.Ed, LLB", experience: "Incumbent CM, Former Union Minister", criminalCases: 0, assets: "₹16.7 Lakhs" },
      { name: "Suvendu Adhikari", party: "BJP", education: "Post Graduate", experience: "Leader of Opposition, Former Minister", criminalCases: 0, assets: "₹1.1 Crores" }
    ]
  },
  "Tamil Nadu": {
    issues: [
      {
        category: "Education",
        partyA: { name: "DMK", stance: "Abolition of NEET exams in TN and 7.5% horizontal reservation for govt school students.", source: "Social Justice, Page 3" },
        partyB: { name: "AIADMK", stance: "Free coaching centers for competitive exams and reviving the 'Amma' laptop scheme.", source: "Education First, Page 11" }
      },
      {
        category: "Employment",
        partyA: { name: "DMK", stance: "Attracting ₹10 Lakh Crore investment to make TN a $1 Trillion economy by 2030.", source: "Economic Roadmap, Page 1" },
        partyB: { name: "AIADMK", stance: "Interest-free loans for startup youth and focus on textile sector job growth.", source: "Industrial Vision, Page 7" }
      }
    ],
    candidates: [
      { name: "M. K. Stalin", party: "DMK", education: "Graduate", experience: "Incumbent CM, 40+ Years in Public Service", criminalCases: 0, assets: "₹8.9 Crores" },
      { name: "Edappadi K. Palaniswami", party: "AIADMK", education: "B.Sc.", experience: "Former CM, Leader of Opposition", criminalCases: 0, assets: "₹6.7 Crores" }
    ]
  },
  "Karnataka": {
    issues: [
      {
        category: "Healthcare",
        partyA: { name: "INC", stance: "Setting up 'Indira Clinics' in all wards and expanding 'Arogya Karnataka' coverage.", source: "Guarantees, Page 5" },
        partyB: { name: "BJP", stance: "Setting up AIIMS in Hubballi and expanding medical seats in rural areas.", source: "Health Infrastructure, Page 2" }
      },
      {
        category: "Environment",
        partyA: { name: "INC", stance: "Promoting EV charging infrastructure and protecting the Western Ghats from mining.", source: "Green Karnataka, Page 10" },
        partyB: { name: "BJP", stance: "Interlinking of rivers for irrigation and reforestation projects in North Karnataka.", source: "Water Security, Page 8" }
      }
    ],
    candidates: [
      { name: "Siddaramaiah", party: "INC", education: "B.Sc., LLB", experience: "Incumbent CM, 9-time MLA", criminalCases: 0, assets: "₹19.2 Crores" },
      { name: "B. Y. Vijayendra", party: "BJP", education: "Graduate in Law", experience: "State Party President, MLA", criminalCases: 0, assets: "₹12.5 Crores" }
    ]
  },
  "Delhi": {
    issues: [
      {
        category: "Education",
        partyA: { name: "AAP", stance: "Expansion of 'Happiness Curriculum' and building 100 more world-class school buildings.", source: "Education Model, Page 1" },
        partyB: { name: "BJP", stance: "Opening new central schools and focusing on vocational training in high schools.", source: "Delhi Vision, Page 4" }
      },
      {
        category: "Environment",
        partyA: { name: "AAP", stance: "Deploying 5000 new electric buses and massive tree plantation drives to curb smog.", source: "Clean Delhi, Page 8" },
        partyB: { name: "BJP", stance: "Improving landfill management and cleaning the Yamuna river on a war footing.", source: "Yamuna Rejuvenation, Page 3" }
      }
    ],
    candidates: [
      { name: "Atishi", party: "AAP", education: "Oxford Alumna, Rhodes Scholar", experience: "Incumbent CM, Former Education Minister", criminalCases: 0, assets: "₹1.4 Crores" },
      { name: "Vijender Gupta", party: "BJP", education: "Post Graduate", experience: "Leader of Opposition, Former Mayor", criminalCases: 0, assets: "₹8.5 Crores" }
    ]
  },
  "Bihar": {
    issues: [
      {
        category: "Employment",
        partyA: { name: "BJP", stance: "Building industrial hubs and promoting food processing units in Seemanchal.", source: "Atmanirbhar Bihar, Page 6" },
        partyB: { name: "RJD", stance: "Providing 10 lakh government jobs and regularizing all contractual employees.", source: "Parivartan Patra, Page 2" }
      },
      {
        category: "Agriculture",
        partyA: { name: "BJP", stance: "Expanding irrigation network and setting up dairy co-operatives in every village.", source: "Farmer Plan, Page 5" },
        partyB: { name: "RJD", stance: "Reviving defunct sugar mills and providing interest-free loans for farm equipment.", source: "Rural Economy, Page 8" }
      }
    ],
    candidates: [
      { name: "Samrat Choudhary", party: "BJP", education: "Graduate", experience: "Incumbent CM, Former Deputy CM", criminalCases: 0, assets: "₹4.8 Crores" },
      { name: "Tejashwi Yadav", party: "RJD", education: "Matriculate", experience: "Former Deputy CM, Leader of Opposition", criminalCases: 0, assets: "₹5.9 Crores" }
    ]
  },
  "Gujarat": {
    issues: [
      {
        category: "Infrastructure",
        partyA: { name: "BJP", stance: "Completion of Dholera SIR and High-Speed Rail (Bullet Train) corridor.", source: "Vibrant Gujarat, Page 10" },
        partyB: { name: "INC", stance: "Focus on rural sanitation and improving local road networks in tribal belts.", source: "People's Manifesto, Page 5" }
      }
    ],
    candidates: [
      { name: "Bhupendrabhai Patel", party: "BJP", education: "Diploma in Civil Engg", experience: "Incumbent CM, Former AUDA Chairman", criminalCases: 0, assets: "₹8.2 Crores" },
      { name: "Amit Chavda", party: "INC", education: "Graduate", experience: "CLP Leader, Former State President", criminalCases: 0, assets: "₹2.5 Crores" }
    ]
  },
  "Kerala": {
    issues: [
      {
        category: "Healthcare",
        partyA: { name: "LDF", stance: "Expansion of 'K-Health' app and upgrading primary health centers to family health centers.", source: "Progressive Kerala, Page 4" },
        partyB: { name: "UDF", stance: "Implementing insurance for all chronic disease patients and new cancer specialty hospitals.", source: "UDF Vision, Page 12" }
      }
    ],
    candidates: [
      { name: "Pinarayi Vijayan", party: "LDF (CPI-M)", education: "Graduate", experience: "Incumbent CM, 2-term CM", criminalCases: 0, assets: "₹1.1 Crores" },
      { name: "V. D. Satheesan", party: "UDF (INC)", education: "MA, LLB", experience: "Leader of Opposition, 5-term MLA", criminalCases: 0, assets: "₹1.4 Crores" }
    ]
  },
  "Telangana": {
    issues: [
      {
        category: "Agriculture",
        partyA: { name: "INC", stance: "Implementing 'Rythu Bharosa' with ₹15,000 per acre annual investment support.", source: "Abhaya Hastham, Page 2" },
        partyB: { name: "BRS", stance: "Expansion of Kaleshwaram project and continuing 'Rythu Bandhu' payments.", source: "State Vision, Page 7" }
      }
    ],
    candidates: [
      { name: "A. Revanth Reddy", party: "INC", education: "Graduate", experience: "Incumbent CM, Former MP", criminalCases: 0, assets: "₹30.5 Crores" },
      { name: "K. Chandrashekar Rao", party: "BRS", education: "Post Graduate", experience: "Former CM, 40+ Years in Politics", criminalCases: 0, assets: "₹23.5 Crores" }
    ]
  },
  "Andhra Pradesh": generateDefaultState(
    "N. Chandrababu Naidu", "TDP", "M.A. Economics", "Incumbent CM, 14 Years as CM previously", "₹29.3 Crores",
    "Y. S. Jagan Mohan Reddy", "YSRCP", "B.Com", "Former CM", "₹510 Crores"
  ),
  "Arunachal Pradesh": generateDefaultState(
    "Pema Khandu", "BJP", "Graduate", "Incumbent CM since 2016", "₹163 Crores",
    "Nabam Tuki", "INC", "Graduate", "Former CM", "₹12 Crores"
  ),
  "Assam": generateDefaultState(
    "Himanta Biswa Sarma", "BJP", "Ph.D", "Incumbent CM, Former Health Minister", "₹17.2 Crores",
    "Debabrata Saikia", "INC", "Graduate", "Leader of Opposition", "₹3.5 Crores"
  ),
  "Chhattisgarh": generateDefaultState(
    "Vishnu Deo Sai", "BJP", "Graduate", "Incumbent CM, Former Union Minister", "₹3.8 Crores",
    "Charan Das Mahant", "INC", "Ph.D", "Leader of Opposition, Former Speaker", "₹8.2 Crores"
  ),
  "Goa": generateDefaultState(
    "Pramod Sawant", "BJP", "BAMS (Ayurveda)", "Incumbent CM", "₹9.3 Crores",
    "Yuri Alemao", "INC", "Commercial Pilot", "Leader of Opposition", "₹42 Crores"
  ),
  "Haryana": generateDefaultState(
    "Nayab Singh Saini", "BJP", "B.A., LLB", "Incumbent CM", "₹3.5 Crores",
    "Bhupinder Singh Hooda", "INC", "B.A., LLB", "Former CM, Leader of Opposition", "₹15.8 Crores"
  ),
  "Himachal Pradesh": generateDefaultState(
    "Sukhvinder Singh Sukhu", "INC", "M.A., LLB", "Incumbent CM", "₹7.8 Crores",
    "Jai Ram Thakur", "BJP", "M.A.", "Former CM, Leader of Opposition", "₹5.3 Crores"
  ),
  "Jharkhand": generateDefaultState(
    "Hemant Soren", "JMM", "Intermediate", "Incumbent CM", "₹8.5 Crores",
    "Babulal Marandi", "BJP", "Graduate", "Former CM, Leader of Opposition", "₹2.1 Crores"
  ),
  "Madhya Pradesh": generateDefaultState(
    "Mohan Yadav", "BJP", "Ph.D", "Incumbent CM", "₹42 Crores",
    "Umang Singhar", "INC", "Graduate", "Leader of Opposition", "₹6.8 Crores"
  ),
  "Manipur": generateDefaultState(
    "N. Biren Singh", "BJP", "B.A.", "Incumbent CM", "₹1.5 Crores",
    "Okram Ibobi Singh", "INC", "Graduate", "Former CM, Senior Opposition Leader", "₹2.2 Crores"
  ),
  "Meghalaya": generateDefaultState(
    "Conrad Sangma", "NPP", "MBA", "Incumbent CM", "₹14 Crores",
    "Mukul Sangma", "AITC", "MBBS", "Former CM, Leader of Opposition", "₹28 Crores"
  ),
  "Mizoram": generateDefaultState(
    "Lalduhoma", "ZPM", "B.A.", "Incumbent CM, Former IPS Officer", "₹3.2 Crores",
    "Lalchhandama Ralte", "MNF", "Graduate", "Leader of Opposition", "₹1.8 Crores"
  ),
  "Nagaland": generateDefaultState(
    "Neiphiu Rio", "NDPP", "B.A.", "Incumbent CM", "₹46 Crores",
    "Opposition Vacant", "N/A", "-", "Opposition-less Assembly", "-"
  ),
  "Odisha": generateDefaultState(
    "Mohan Charan Majhi", "BJP", "B.A., LLB", "Incumbent CM", "₹1.9 Crores",
    "Naveen Patnaik", "BJD", "B.A.", "Former CM, Leader of Opposition", "₹71 Crores"
  ),
  "Punjab": generateDefaultState(
    "Bhagwant Mann", "AAP", "College Dropout", "Incumbent CM, Former Comedian", "₹1.9 Crores",
    "Partap Singh Bajwa", "INC", "B.A.", "Leader of Opposition", "₹4.5 Crores"
  ),
  "Rajasthan": generateDefaultState(
    "Bhajan Lal Sharma", "BJP", "M.A.", "Incumbent CM", "₹1.5 Crores",
    "Tika Ram Jully", "INC", "Graduate", "Leader of Opposition", "₹2.8 Crores"
  ),
  "Sikkim": generateDefaultState(
    "Prem Singh Tamang", "SKM", "B.A.", "Incumbent CM", "₹3.1 Crores",
    "Opposition Vacant", "N/A", "-", "Opposition-less Assembly", "-"
  ),
  "Tripura": generateDefaultState(
    "Manik Saha", "BJP", "MDS", "Incumbent CM", "₹13.9 Crores",
    "Jitendra Chaudhury", "CPI(M)", "Graduate", "Leader of Opposition", "₹1.2 Crores"
  ),
  "Uttarakhand": generateDefaultState(
    "Pushkar Singh Dhami", "BJP", "M.A., LLB", "Incumbent CM", "₹3.3 Crores",
    "Yashpal Arya", "INC", "B.A., LLB", "Leader of Opposition", "₹5.1 Crores"
  ),
  "Puducherry": generateDefaultState(
    "N. Rangaswamy", "AINRC", "B.Com, B.L.", "Incumbent CM", "₹3.8 Crores",
    "R. Siva", "DMK", "Graduate", "Leader of Opposition", "₹18 Crores"
  ),
  "Jammu and Kashmir": generateDefaultState(
    "Omar Abdullah", "JKNC", "B.Com", "Incumbent CM", "₹11 Crores",
    "Sunil Sharma", "BJP", "Graduate", "Leader of Opposition", "₹3.5 Crores"
  )
};
