
import mongoose from "mongoose";

const shapeSchema = new mongoose.Schema({
  roomId: String,
  userId: String,

  type: {
    type: String,
    enum:["line","rectangle","circle"],
    required: true,
  },

  color: {
    type: String,
    default: "#000000",
  },

  strokeWidth: {
    type: Number,
    default: 2,
  },

  data: {
    type: Object,
    required: true,
  },
},{
    timestamps:true
});

export const ShapeModel = mongoose.model(
  "Shape",
  shapeSchema
);