import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, email, phone, groupPicks, bracket, champion } = body;
    
    if (!name || !email || !phone || !bracket || !champion) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }
    
    const newPrediction = new Prediction({
      name,
      email,
      phone,
      groupPicks,
      bracket,
      champion
    });
    
    await newPrediction.save();
    
    return Response.json({ message: "Prediction saved successfully" }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
