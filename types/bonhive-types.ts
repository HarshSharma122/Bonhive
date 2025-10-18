import { Event, View } from "react-big-calendar";

// for payment file
export interface RazorpayOptions {
  key?: string;
  amount?: number;
  currency?: string;
  order_id?: string;
  subscription_id?: string;
  name?: string;
  description?: string;
  handler?: (response: RazorpaySubscriptionResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}
export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentFailure {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

export interface RazorpayInstance {
  open(): void;
  on(
    event: "payment.failed",
    callback: (response: RazorpayPaymentFailure) => void
  ): void;
  on(
    event: "payment.success",
    callback: (response: RazorpayPaymentSuccess) => void
  ): void;
  on(event: string, callback: (response: unknown) => void): void; // fallback
  close(): void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}
export interface RazorpaySubscriptionResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// for features section
export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'green' | 'purple' | 'blue' | 'red' | 'yellow' | 'indigo';
}








export type CardProps = {
  title: string;
  value?: string | number;
  delay: number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
};







// for date file
export interface CalendarEventType {
  userName: string;
  price: number;
  date: string;
  month: string;
  year: string;
  projectName: string;
  time: string;
  duration: string;
}

export type EventType = "meeting" | "deadline" | "milestone" | "task" | "undefined";

export interface CustomCalendarEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  projectName: string;
  price: number;
  duration: string;
  type: EventType;
}

export interface EventTypeConfig {
  value: EventType;
  label: string;
  color: string;
  border: string;
  bg: string;
  text: string;
}

export interface ViewButton {
  view: View;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}




// client management file
export interface ClientType {
  clientName: string;
  userId: string;
  clientBudget: number;
  projectName: string;
  email: string;
  contact: string;
  location: string;
  notes: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string;
}





// for project 

export type color = {
  "proposal-sent": string;
  negotiation: string;
  accepted: string;
  rejected: string;
  "on-hold": string;
  paid: string;
  lead: string;
  pending: string;
  completed: string;
  progress: string;
  review: string;
  "payment pending": string;
};

export type Status = keyof color;


 export type status =
    | "completed"
    | "in progress"
    | "pending"
    | "lead"
    | "proposal-sent"
    | "negotiation"
    | "accepted"
    | "rejected"
    | "on-hold"
    | "paid"
    | "progress"
    | "review"
    | "payment pending";
















    export type CurrencyStoreState = {
      currencyPref: string;
      addCurrencyPref: (currencyPref: string) => void;
    };














    
export interface projectLogs {
  hour: number;
  second: number;
  minute: number;
  rate: number;
  markdown: string;
}
export interface services {
  service_name: string;
  service_type: string;
  service_price: number;
  service_duration: string;
}

export interface projects {
  _id: string;
  projectName: string;
  clientName: string;
  bidAmount: number;
  desc: string;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  clientBudget: number;
  email: string;
  contact: string;
  location: string;
  notes: string;
  leadSource: string;
  proposal: string;
  instructions: string;
  projectLogs: projectLogs[];
  services: services[];
  totalHour: number;
  totalMin: number;
  totalSec: number;
  totalBill: number;
  IshourBillable: boolean;
  completedMonth: string;
  hourlyRate: number;
  userName: string;
  status:
    | "proposal-sent"
    | "negotiation"
    | "accepted"
    | "rejected"
    | "on-hold"
    | "paid"
    | "lead"
    | "pending"
    | "completed"
    | "progress"
    | "review"
    | "payment pending";
}

export type ProjectStoreState = {
  projects: projects[];
  addProjects: (project: projects[]) => void;
  addSingleProject: (project: projects) => void;
};









export type user = {
  userLanguage: string;
  bonhivePlan: string;
  isPlanSelected: boolean;
  clientCount?: number;
  subscrption: {
    createdDate: string;
  };
  oneSignal_id?:string;
};

export type ProfileStoreState = {
  user: user;
  setUser: (user: user) => void;
};

export type statusStoreState = {
  isAnimate: boolean;
  setIsAnimate: (isAnimate: boolean) => void;
};



export type sonnerStoreState = {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
};
export type sonnerDetailsStoreState = {
  sonnerDetails: string;
  addSonnerDetails: (sonnerDetails: string) => void;
};