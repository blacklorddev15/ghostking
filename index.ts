// In index.ts - Make sure this exists and is correct
app.post("/api/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { username } = req.body;
  
  if (!username) {
    console.log("No username provided");
    return res.status(400).json({ error: "Username required" });
  }
  
  console.log("Setting cookie for username:", username);
  
  // Set cookie for 30 days
  res.cookie("session", username, { 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
    path: "/",
    httpOnly: false, // Allow client to read it
  });
  
  res.json({ success: true, username });
});