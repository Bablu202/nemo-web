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
type UserType = {
  id: string;
  email: string;
  provider: string | undefined;
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
