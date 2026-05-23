const express = require("express");
const router = express.Router();

const Review = require("../models/Review");


// Add Review
router.post("/add-review", async (req,res)=>{

  const review = new Review(req.body);

  await review.save();

  res.json({message:"Review added"});
});


// Get Reviews for Medicine
router.get("/reviews/:medicine", async (req,res)=>{

  const reviews = await Review.find({
    medicine_name: req.params.medicine
  });

  res.json(reviews);

});

module.exports = router;