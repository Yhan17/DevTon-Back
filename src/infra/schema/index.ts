import { Schema, model } from "mongoose"
import { IDev } from "../../domain/interfaces"

const devSchema = new Schema<IDev>({
  name: {
    type: String,
    required: false,
    default: null
  },
  user: {
    type: String,
    required: true,
  },
  bio: String,
  isFirstTime: {
    type: Boolean,
    required: false,
    default: true
  },
  avatar: {
    type: String,
    required: true,
  },
  languages: [{
    type: String,
    required: false,
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
  dislikes: [{
    type: Schema.Types.ObjectId,
    ref: 'Dev',
  }],
},
  {
    timestamps: true,
  }
);

const DevSchema = model<IDev>("Dev", devSchema)

export default DevSchema
