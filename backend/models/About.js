import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    photoUrl: {
      type: String,
      default: "",
    },

    photoPublicId: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (skills) => skills.length <= 50,
        message: "You can add up to 50 skills.",
      },
    },
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

export default About;