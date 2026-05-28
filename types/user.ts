export type SessionUser = {
  userId: string;
  email: string;
  name: string;
};

export type UserDocument = {
  _id?: import("mongodb").ObjectId;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
};
