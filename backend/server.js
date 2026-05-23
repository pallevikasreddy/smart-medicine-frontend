require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const { GoogleGenerativeAI } = require("@google/generative-ai")

const Medicine = require("./models/Medicine")
const Review = require("./models/Review")
const User = require("./models/User")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/pharmacyDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err))

if (!process.env.GOOGLE_API_KEY) {
  console.log("Missing GOOGLE_API_KEY")
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)



app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    res.json({ message: "Signup successful" })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Signup error" })
  }
})


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.json({ message: "User not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.json({ message: "Invalid password" })
    }

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Login error" })
  }
})


app.get("/medicines", async (req, res) => {
  try {
    console.log("/medicines called")

    const medicines = await Medicine.find().limit(50)

    res.json(medicines)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching medicines" })
  }
})


app.post("/add-review", async (req, res) => {
  try {
    const review = new Review(req.body)
    await review.save()
    res.json({ message: "Review added" })
  } catch (err) {
    res.status(500).json({ message: "Error adding review" })
  }
})


app.get("/reviews/:medicine", async (req, res) => {
  try {
    const reviews = await Review.find({
      medicine_name: req.params.medicine
    })

    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" })
  }
})


app.post("/ai-chat", async (req, res) => {

  let medicines = []

  try {

    const userQuery = (req.body.message || "").toLowerCase().trim()

    if (
      userQuery.includes("hi") ||
      userQuery.includes("hello") ||
      userQuery.includes("hey")
    ) {
      return res.json({
        aiText: "Hello Ask me about fever pain or compare medicines",
        medicines: []
      })
    }

    if (userQuery.includes("compare")) {

      const parts = userQuery.split(/vs/i)
      const med1 = parts[0].replace("compare", "").trim()
      const med2 = parts[1]?.trim()

      medicines = await Medicine.find({
        $or: [
          { name: { $regex: med1, $options: "i" } },
          { name: { $regex: med2, $options: "i" } }
        ]
      })

    } else {

      medicines = await Medicine.find({
        $or: [
          { conditions: { $regex: userQuery, $options: "i" } },
          { name: { $regex: userQuery, $options: "i" } }
        ]
      }).limit(5)
    }

    if (medicines.length === 0) {
      return res.json({
        aiText: "No medicines found",
        medicines: []
      })
    }

    medicines.sort((a, b) => b.effectiveness_score - a.effectiveness_score)

    const finalMedicines = await Promise.all(
      medicines.map(async (m) => {

        const reviews = await Review.find({
          medicine_name: m.name
        }).limit(3)

        const avgRating =
          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
          (reviews.length || 1)

        return {
          name: m.name,
          company: m.company,
          uses: m.uses,
          price: m.average_price_inr,
          effectiveness: m.effectiveness_score,
          reviews,
          avgRating: avgRating.toFixed(1)
        }
      })
    )

    const context = finalMedicines.map(m => `
Name: ${m.name}
Uses: ${m.uses?.join(", ")}
Price: Rs ${m.price}
Effectiveness: ${m.effectiveness}
Rating: ${m.avgRating}
`).join("\n")

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const result = await model.generateContent(`
User Question: ${userQuery}

Available Medicines:
${context}

Give short recommendation
Mention best medicine
Keep it simple
Always add:
Please consult a doctor before taking any medicine
`)

    const response = await result.response

    res.json({
      aiText: response.text(),
      medicines: finalMedicines
    })

  } catch (err) {
    console.error("ERROR:", err)

    res.status(500).json({
      aiText: "AI error Showing basic results",
      medicines: medicines.slice(0, 3)
    })
  }

})


app.listen(5000, () => {
  console.log("Server running on port 5000")
})