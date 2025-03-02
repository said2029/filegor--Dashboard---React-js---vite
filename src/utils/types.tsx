import { z, infer as zInfer } from "zod";

const versingApplication = z.object({
  id: z.string().optional(),
  fullName: z.string().optional(),
  versionName: z.string().optional(),
  programId: z.string().uuid().optional().optional(),
  links: z.array(z.string()).optional(), // Assuming links are URLs
  torrents: z.array(z.string()).optional(), // Assuming torrents are URLs
});
const ApplicationSchema = z.object({
  title: z.string().min(5).max(100),
  subtitle: z.string().min(5).max(200),
  description: z.string(),
  size: z.string().min(2).max(14),
  sizeType: z.enum(["KB", "MB", "GB", "TB", "PB"]),
  createdBy: z.string().min(2).max(40),
  uploadedBy: z.string().min(2).max(40),
  licenseType: z.string().min(2).max(100),
  languages: z.array(z.string()).min(1).max(8),
  requirements: z.array(z.string()).optional(),
  subCategory: z.array(z.string().uuid()),
  files: z.any(),
  icon: z.any().optional(),
  category: z.any(),
  versions: z.array(versingApplication).optional(),
  versionsIds: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  id: z.string().optional(),
  createAt: z.string().optional(),
});

const SubCategorySchema = z.object({
  id: z.string().optional(),
  file: z.any(),
  name: z.string().min(5).max(30),
  slug: z.string().optional(),
  categoryIds: z.array(z.string().min(1)).optional(),
  createAt: z.string().optional(),
  image: z.string().optional(),
  category: z.array(z.any()).optional(),
});

const CategorySchema = z.object({
  id: z.string().optional(),
  file: z.any().optional(),
  name: z.string().min(5).max(30),
  slug: z.string().optional(),
  subCategory: z.array(SubCategorySchema).optional(),
  subCategoryIds: z.array(z.string().min(1)).optional(),
  program: z.array(ApplicationSchema).optional(),
  image: z.string().optional(),
  createAt: z.string().optional(),
});

const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().nullable(),
  imageProfile: z.string(),
  username: z.string().nullable(),
  email: z.string().email(),
  userType: z.enum(["admin", "user", "moderator"]),
  isAccountValid: z.boolean(),
});

export type ApplicationType = zInfer<typeof ApplicationSchema>;
export type CategoryType = zInfer<typeof CategorySchema>;
export type SubCategoryType = zInfer<typeof SubCategorySchema>;
export type Usertype = zInfer<typeof UserSchema>;

export { ApplicationSchema, CategorySchema, SubCategorySchema, UserSchema };
