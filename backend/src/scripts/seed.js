import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env.js";
import { Category } from "../models/Category.js";
import { Course } from "../models/Course.js";
import { Enrollment } from "../models/Enrollment.js";
import { Roadmap } from "../models/Roadmap.js";
import { SiteContent } from "../models/SiteContent.js";
import { User } from "../models/User.js";
import { defaultRoadmapModules, seedCategories, seedCourses, seedSiteContent, seedUsers } from "../data/seedData.js";

if (!env.mongoUri) {
  console.error("MONGODB_URI is required for npm run seed.");
  process.exit(1);
}

await mongoose.connect(env.mongoUri);

try {
  const categoryMap = new Map();
  for (const item of seedCategories) {
    const category = await Category.findOneAndUpdate(
      { slug: item.slug },
      { name: item.name, slug: item.slug, track: item.track },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    categoryMap.set(item.id, category);
  }

  const userMap = new Map();
  for (const item of seedUsers) {
    const passwordHash = await bcrypt.hash(item.password, 10);
    const user = await User.findOneAndUpdate(
      { email: item.email },
      {
        firstName: item.firstName,
        lastName: item.lastName,
        phone: item.phone,
        email: item.email,
        passwordHash,
        role: item.role,
        isActive: item.isActive,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    userMap.set(item.id, user);
  }

  for (const item of seedCourses) {
    const course = await Course.findOneAndUpdate(
      { slug: item.slug },
      {
        ...item,
        categoryId: categoryMap.get(item.categoryId)._id,
        instructorId: userMap.get(item.instructorId)?._id || null,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await Roadmap.findOneAndUpdate(
      { courseId: course._id },
      { courseId: course._id, modules: defaultRoadmapModules },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  const student = userMap.get("u-student");
  const fullstack = await Course.findOne({ slug: "phat-trien-web-full-stack" });
  if (student && fullstack) {
    await Enrollment.findOneAndUpdate(
      { userId: student._id, courseId: fullstack._id },
      {
        userId: student._id,
        courseId: fullstack._id,
        cohortId: "seed-fullstack-online",
        status: "active",
        paymentModel: "upfront",
        formatType: "online",
        finalPrice: fullstack.basePrice,
        monthlyPrice: null,
        progress: {},
        startDate: new Date(),
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  await SiteContent.findOneAndUpdate(
    { key: "default" },
    { key: "default", ...seedSiteContent },
    { upsert: true, setDefaultsOnInsert: true }
  );

  console.log("Seed completed.");
} finally {
  await mongoose.disconnect();
}
