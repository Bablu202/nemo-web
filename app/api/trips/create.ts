import supabase from "@/lib/supabase/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      image,
      title,
      start_date,
      return_date,
      duration,
      status,
      price,
      seats,
    } = req.body;
    const { data, error } = await supabase
      .from("nemo_upcoming_trip_details")
      .insert([
        {
          image,
          title,
          start_date,
          return_date,
          duration,
          status,
          price,
          seats,
        },
      ]);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ data });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
