import mongoose from 'mongoose';

// Theo đề: userId là string
const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true } // tự có createdAt, updatedAt
);

postSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
