export interface PoeFirstResponse {
  id: string;
  complexity: number;
  result: string[];
  total: number;
}

export interface ResponseLeagueList {
  result: {
    id: string;
    realm: string;
    text: string;
  }[];
}

export interface PoeTradeDataItemsResponse {
  result: PoeTradeDataItemsResult[];
}
export interface PoeTradeDataItemsResult {
  id: string;
  label: string;
  entries: {
    name?: string;
    type: string;
    text: string;
    flags?: {
      unique?: boolean;
    };
  }[];
}

export interface PoeSecondResponse {
  result: PoeSecondResult[];
}

export interface PoeSecondResult {
  id: string;
  listing: {
    method: 'psapi';
    indexed: Date;
    stash: { name: string; x: number; y: number };
    whisper: string;
    whisper_token: string;
    account: {
      name: string;
      lastCharacterName: string;
      online: { league: string };
      language: string;
      realm: string;
    };
    price: {
      type: string;
      amount: number;
      currency: string;
    };
  };
  item: Item;
}
interface Item {
  verified: boolean;
  w: number;
  h: number;
  icon: string;
  support?: boolean;
  stackSize?: number;
  maxStackSize?: number;
  stackSizeText?: string;
  league?: string;
  id?: string;
  influences?: object;
  elder?: true;
  shaper?: true;
  searing?: true;
  tangled?: true;
  abyssJewel?: true;
  delve?: true;
  fractured?: true;
  synthesised?: true;
  name: string;
  sockets?: ItemSocket[];
  socketedItems?: Item[];
  typeLine: string;
  baseType: string;
  identified: boolean;
  itemLevel?: number;
  ilvl: number;
  note?: string;
  forum_note?: string;
  lockedToCharacter?: true;
  lockedToAccount?: true;
  duplicated?: true;
  split?: true;
  corrupted?: true;
  unmodifiable?: true;
  cisRaceReward?: true;
  seaRaceReward?: true;
  thRaceReward?: true;
  properties?: ItemProperty[];
  notableProperties?: ItemProperty[];
  requirements?: ItemProperty[];
  additionalProperties?: ItemProperty[];
  nextLevelRequirements?: ItemProperty[];
  talismanTier?: number;
  secDescrText?: string;
  utilityMods?: string[];
  logbookMods?: Array<{
    name: string;
    faction: {
      id: string;
      name: string;
    };
    mods: string[];
  }>;
  enchantMods?: string[];
  scourgeMods?: string[];
  implicitMods?: string[];
  ultimatumMods?: { type: string; tier: number }[];
  explicitMods?: string[];
  craftedMods?: string[];
  fracturedMods?: string[];
  cosmeticMods?: string[];
  veiledMods?: string[];
  veiled?: true;
  descrText?: string;
  flavourText?: string[];
  flavourTextParsed?: string[];
  prophecyText?: string;
  isRelic?: true;
  replica?: true;
  incubatedItem?: {
    name: string;
    level: number;
    progress: number;
    total: number;
  };
  scourged?: {
    tier: number;
    level?: number;
    progress?: number;
    total?: number;
  };
  frameType?: number;

  artFilename?: string;
  hybrid?: {
    isVaalGem?: boolean;
    baseTypeName?: string;
    properties?: ItemProperty[];
  };
  extended?: {
    category?: string;
    subcategories?: string[];
    prefixes?: number;
    suffixes?: number;
    text: string;
  };
  x?: number;
  y?: number;
  inventoryId: string;
  socket: number;
  colour?: string;
}

interface ItemProperty {
  name: string;
  values: [[string, number]];
  displayMode: number;
  type?: number;
  progress?: number;
  suffix?: string;
}
interface ItemSocket {
  group: number;
  attr: 'S' | 'D' | 'I' | 'G' | 'A' | 'DV';
  sColour: 'R' | 'G' | 'B' | 'W' | 'A' | 'DV';
}
