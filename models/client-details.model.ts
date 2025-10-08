import mongoose, { models, Schema } from "mongoose";

interface clientType {
  clientName: string;
  projectName:string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  clientBudget: number;
  email: string;
  contact: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags:string;
  notes: string;
}
const clientSchema = new Schema<clientType>(
  {
    clientName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    clientBudget: {
      type: Number,
      required: true,
    },
    rating:{
      type:Number
    },
    projectName:{
      type:String,
      required:true,
    },
    tags:{
      type:String
    }, 
    email: {
      type: String,
    },
    contact: {
      type: String,
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const CLIENT = models?.CLIENT || mongoose.model("CLIENT", clientSchema);
export default CLIENT;
