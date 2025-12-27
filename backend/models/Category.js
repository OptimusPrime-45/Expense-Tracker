import mongoose, {Schema} from 'mongoose';

const categorySchema = new Schema(
    {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
        name: {
          type: String,
          required: [true, 'Please add a category name'],
          trim: true,
        },
        icon: {
          type: String,
          default: 'default',
        },
        color: {
          type: String,
          default: '#000000',
        },
      },
    { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);