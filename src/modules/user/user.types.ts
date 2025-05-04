export type SearchUserParams = {
  userIds?: string[];
  phoneNumbers?: string[];
  take?: number;
  skip?: number;
};

export type CheckExistUserParams = {
  phoneNumber: string;
};
