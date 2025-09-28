import mongoose, { models, Schema } from "mongoose";

interface GraphInter {
  userId: string;
  chartData: string[];
}

const graphSchema = new Schema<GraphInter>(
  {
    userId: {
      type: String,
      required: true,
    },
    chartData: [
      {
        name: {
          type: String,
          required: true,
        },
        projects: {
          type: String,
          required: true,
        },

        completed: {
          type: String,
          required: true,
        },

        revenue: {
          type: String,
          required: true,
        },
        goal: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Graph = models?.Graph || mongoose.model("Graph", graphSchema);
export default Graph;
