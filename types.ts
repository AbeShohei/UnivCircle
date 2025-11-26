export enum CircleCategory {
  SPORTS = 'スポーツ',
  CULTURE = '文化・芸術',
  ACADEMIC = '学術・研究',
  MUSIC = '音楽',
  VOLUNTEER = 'ボランティア',
  OTHER = 'その他',
}

// Keeping for backward compatibility if needed, but strings are preferred now
export enum Campus {
  WASEDA = '早稲田キャンパス',
  TOYAMA = '戸山キャンパス',
  NISHIWASEDA = '西早稲田キャンパス',
  TOKOROZAWA = '所沢キャンパス',
}

export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  location: string;
  capacity: string;
  startTime: string;
  endTime: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface MemberBreakdown {
  gender: {
    male: number;
    female: number;
  };
  grade: {
    y1: number;
    y2: number;
    y3: number;
    y4: number;
    other: number; // Graduate or 5th+
  };
}

export interface Circle {
  id: string;
  name: string;
  university: string;
  category: CircleCategory;
  description: string;
  shortDescription: string;
  tags: string[];
  campus: string[];
  activityDays: string[];
  memberCount: number;
  memberBreakdown?: MemberBreakdown; // Optional breakdown
  showMemberBreakdown?: boolean; // Toggle visibility
  representativeEmail?: string; // Contact email for the representative
  contactEmail?: string; // Email for contact form notifications
  imageUrl: string;
  images: string[];
  instagramUrl?: string;
  twitterUrl?: string;
  foundedYear: number;
  fee: string;
  schedules: ScheduleEvent[]; // Welcome schedules
  customFields: CustomField[]; // Arbitrary basic info fields
  faqs: FAQ[]; // Frequently Asked Questions
}

export interface FilterState {
  keyword: string;
  university: string;
  category: CircleCategory | null;
  campus: string | null;
  tags: string[];
}