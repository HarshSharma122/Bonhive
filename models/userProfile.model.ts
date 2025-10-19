import mongoose, { models, Schema } from "mongoose";
interface Invoice {
  invoice_number: number;
  invoice_owner: string;
  invoice_id: string;
  invoice_issue_date: string;
}
type user = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  userName:string;
  userLanguage: string;
  invoices: Invoice[];
  createdAt: Date;
  updatedAt: Date;
  bonhivePlan: string;
  isPlanSelected: boolean;
  projectCount: number;
  subscrption: {
    id: string;
    status: string;
    price: number;
    createdDate:Date
  };

  user_feedback: {
    feedBack_type: string;
    feedBack: string;
  };
  clientCount: number;
  oneSignal_id:string;
};

const userProfileSchema = new Schema<user>(
  {
    userId: {
      type: String,
      required: true,
    },
    userName:{
      type:String
    },
    userLanguage: {
      type: String,
    },
    invoices: [
      {
        invoice_number: Number,
        invoice_owner: String,
        invoice_id: String,
        invoice_issue_date: String,
      },
    ],
    bonhivePlan: {
      type: String,
    },
    isPlanSelected: { type: Boolean, default: false },
    projectCount: { type: Number, default: 0 },
    subscrption: {
      id: String,
      status: String,
      price: Number,
      createdDate:Date
    },
    clientCount: { type: Number, default: 0 },
    user_feedback: {
      feedBack_type: String,
      feedBack: String,
    },
    oneSignal_id:{
      type:String,
      default:"0"
    }
  },
  {
    timestamps: true,
  }
);

const UserProfile =
  models?.UserProfile || mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
