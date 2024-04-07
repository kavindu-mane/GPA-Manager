// types for validation error
export type errorTypes = {
  email?: string[];
  password?: string[];
  name?: string[];
  repeat_password?: string[];
  message?: string;
  semester?: string[];
  subject?: string[];
  grade?: string[];
  credits?: string[];
};

//  user account data type
export type userDataType = {
  id?: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

//  private routing object type
export type privateRouteType = {
  [key: string]: JSX.Element;
};

//semester response data type
export type semesterDataType = {
  id: string;
  name: string;
}[];

// subject response data type
export type subjectDataType = {
  id: string;
  name: string;
  totalCredits: number;
  gpa: number;
  courses: {
    id: number;
    name: string;
    grade: string;
    gpa: number;
    credits: number;
  }[];
};

// table dropdown type
export type tableDropDown = {
  [key: number]: boolean;
};
