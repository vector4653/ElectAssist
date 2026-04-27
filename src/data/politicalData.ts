export interface PoliticalData {
  rulingParty: string;
  chiefMinister: string;
  assemblySeats: number;
  lokSabhaSeats: number;
}

export const PARTY_LOGOS: Record<string, string> = {
  "BJP": "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_of_the_Bharatiya_Janata_Party.svg",
  "INC": "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_National_Congress_hand_logo.svg",
  "AAP": "https://commons.wikimedia.org/wiki/Special:FilePath/Aam_Aadmi_Party_logo_%28English%29.svg",
  "YSRCP": "https://commons.wikimedia.org/wiki/Special:FilePath/Ceiling_fan.svg",
  "JDU-BJP": "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_of_the_Bharatiya_Janata_Party.svg",
  "JMM-INC": "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_National_Congress_hand_logo.svg",
  "LDF (CPI-M)": "https://commons.wikimedia.org/wiki/Special:FilePath/Hammer_and_sickle_red_on_transparent.svg",
  "Mahayuti (Shiv Sena, BJP, NCP)": "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Election_Symbol_Bow_And_Arrow2.svg",
  "NPP": "https://commons.wikimedia.org/wiki/Special:FilePath/Book_symbol.svg",
  "ZPM": "https://commons.wikimedia.org/wiki/Special:FilePath/A_hat_or_topi.png",
  "NDPP": "https://commons.wikimedia.org/wiki/Special:FilePath/Globe_symbol.svg",
  "BJD": "https://commons.wikimedia.org/wiki/Special:FilePath/Indian_Election_Symbol_Conch.svg",
  "SKM": "https://commons.wikimedia.org/wiki/Special:FilePath/Table_lamp_symbol.svg",
  "DMK": "https://commons.wikimedia.org/wiki/Special:FilePath/Rising_sun_symbol.svg",
  "TMC": "https://commons.wikimedia.org/wiki/Special:FilePath/All_India_Trinamool_Congress_flag.svg",
  "AINRC": "https://commons.wikimedia.org/wiki/Special:FilePath/Jug_symbol.svg",
  "President's Rule": "https://commons.wikimedia.org/wiki/Special:FilePath/Emblem_of_India.svg"
};

export const STATE_POLITICAL_DATA: Record<string, PoliticalData> = {
  "Andhra Pradesh": {
    rulingParty: "YSRCP",
    chiefMinister: "Y. S. Jagan Mohan Reddy",
    assemblySeats: 175,
    lokSabhaSeats: 25
  },
  "Arunachal Pradesh": {
    rulingParty: "BJP",
    chiefMinister: "Pema Khandu",
    assemblySeats: 60,
    lokSabhaSeats: 2
  },
  "Assam": {
    rulingParty: "BJP",
    chiefMinister: "Himanta Biswa Sarma",
    assemblySeats: 126,
    lokSabhaSeats: 14
  },
  "Bihar": {
    rulingParty: "JDU-BJP",
    chiefMinister: "Nitish Kumar",
    assemblySeats: 243,
    lokSabhaSeats: 40
  },
  "Chhattisgarh": {
    rulingParty: "BJP",
    chiefMinister: "Vishnu Deo Sai",
    assemblySeats: 90,
    lokSabhaSeats: 11
  },
  "Goa": {
    rulingParty: "BJP",
    chiefMinister: "Pramod Sawant",
    assemblySeats: 40,
    lokSabhaSeats: 2
  },
  "Gujarat": {
    rulingParty: "BJP",
    chiefMinister: "Bhupendrabhai Patel",
    assemblySeats: 182,
    lokSabhaSeats: 26
  },
  "Haryana": {
    rulingParty: "BJP",
    chiefMinister: "Nayab Singh Saini",
    assemblySeats: 90,
    lokSabhaSeats: 10
  },
  "Himachal Pradesh": {
    rulingParty: "INC",
    chiefMinister: "Sukhvinder Singh Sukhu",
    assemblySeats: 68,
    lokSabhaSeats: 4
  },
  "Jharkhand": {
    rulingParty: "JMM-INC",
    chiefMinister: "Champai Soren",
    assemblySeats: 81,
    lokSabhaSeats: 14
  },
  "Karnataka": {
    rulingParty: "INC",
    chiefMinister: "Siddaramaiah",
    assemblySeats: 224,
    lokSabhaSeats: 28
  },
  "Kerala": {
    rulingParty: "LDF (CPI-M)",
    chiefMinister: "Pinarayi Vijayan",
    assemblySeats: 140,
    lokSabhaSeats: 20
  },
  "Madhya Pradesh": {
    rulingParty: "BJP",
    chiefMinister: "Mohan Yadav",
    assemblySeats: 230,
    lokSabhaSeats: 29
  },
  "Maharashtra": {
    rulingParty: "Mahayuti (Shiv Sena, BJP, NCP)",
    chiefMinister: "Eknath Shinde",
    assemblySeats: 288,
    lokSabhaSeats: 48
  },
  "Manipur": {
    rulingParty: "BJP",
    chiefMinister: "N. Biren Singh",
    assemblySeats: 60,
    lokSabhaSeats: 2
  },
  "Meghalaya": {
    rulingParty: "NPP",
    chiefMinister: "Conrad Sangma",
    assemblySeats: 60,
    lokSabhaSeats: 2
  },
  "Mizoram": {
    rulingParty: "ZPM",
    chiefMinister: "Lalduhoma",
    assemblySeats: 40,
    lokSabhaSeats: 1
  },
  "Nagaland": {
    rulingParty: "NDPP",
    chiefMinister: "Neiphiu Rio",
    assemblySeats: 60,
    lokSabhaSeats: 1
  },
  "Odisha": {
    rulingParty: "BJD",
    chiefMinister: "Naveen Patnaik",
    assemblySeats: 147,
    lokSabhaSeats: 21
  },
  "Punjab": {
    rulingParty: "AAP",
    chiefMinister: "Bhagwant Mann",
    assemblySeats: 117,
    lokSabhaSeats: 13
  },
  "Rajasthan": {
    rulingParty: "BJP",
    chiefMinister: "Bhajan Lal Sharma",
    assemblySeats: 200,
    lokSabhaSeats: 25
  },
  "Sikkim": {
    rulingParty: "SKM",
    chiefMinister: "Prem Singh Tamang",
    assemblySeats: 32,
    lokSabhaSeats: 1
  },
  "Tamil Nadu": {
    rulingParty: "DMK",
    chiefMinister: "M. K. Stalin",
    assemblySeats: 234,
    lokSabhaSeats: 39
  },
  "Telangana": {
    rulingParty: "INC",
    chiefMinister: "A. Revanth Reddy",
    assemblySeats: 119,
    lokSabhaSeats: 17
  },
  "Tripura": {
    rulingParty: "BJP",
    chiefMinister: "Manik Saha",
    assemblySeats: 60,
    lokSabhaSeats: 2
  },
  "Uttar Pradesh": {
    rulingParty: "BJP",
    chiefMinister: "Yogi Adityanath",
    assemblySeats: 403,
    lokSabhaSeats: 80
  },
  "Uttarakhand": {
    rulingParty: "BJP",
    chiefMinister: "Pushkar Singh Dhami",
    assemblySeats: 70,
    lokSabhaSeats: 5
  },
  "West Bengal": {
    rulingParty: "TMC",
    chiefMinister: "Mamata Banerjee",
    assemblySeats: 294,
    lokSabhaSeats: 42
  },
  "Delhi": {
    rulingParty: "AAP",
    chiefMinister: "Arvind Kejriwal",
    assemblySeats: 70,
    lokSabhaSeats: 7
  },
  "Jammu & Kashmir": {
    rulingParty: "President's Rule",
    chiefMinister: "N/A",
    assemblySeats: 90,
    lokSabhaSeats: 5
  },
  "Puducherry": {
    rulingParty: "AINRC",
    chiefMinister: "N. Rangaswamy",
    assemblySeats: 30,
    lokSabhaSeats: 1
  }
};
