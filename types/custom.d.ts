interface Trip {
  id: number;
  url: string; // for page url to share
  image: string[];
  title: string;
  start_date: string;
  return_date: string;
  duration: string;
  status: string;
  price: number;
  seats: number;
  plan: string[];
}

// interface Post {
//   id: number;
//   url: string;
//   imageURL: string[];
//   title: string;
//   startDate: string;
//   returnDate: string;
//   duration: string;
//   status: string;
//   price: number;
//   seats: number;
// }
export type UserType = {
  id: string;
  email?: string;
  role?: string;
  provider?: string; // Add provider field
  picture?: string; // Add picture field
  created_at: string;
  name?: string;
  mobile_number?: string;
  date_of_birth?: string;
  profession?: string;
  gender?: string;
};

type UpdateUserType = {
  id: string;
  name?: string;
  mobile_number?: string;
  date_of_birth?: string;
  profession?: string;
  gender?: string;
};

export type ReviewType = {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
};

//export type ReviewInputType = Omit<ReviewType, "id" | "created_at">;
