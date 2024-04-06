// types for validation error
export type errorTypes = {
  email?: string[];
  password?: string[];
  name?: string[];
  repeat_password?: string[];
  message?: string;
};

//  user account data type
export type userDataType = {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};
