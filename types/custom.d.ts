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
  role: string | undefined;
  email: string | undefined;
  provider: string | undefined;
  created_at: string;
};
