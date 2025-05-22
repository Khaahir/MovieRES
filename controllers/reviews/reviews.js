import express from "express"
import movieModel from "../../models/movieschema.js"
import userModel from "../../models/userSchema.js"
import reviewModel from "../../models/reviewSchema.js"
const router = express.Router()

router.get("/", async (req,res)=>{
  try{

    const findReviews = await reviewModel.find()
    if(!findReviews){
      return res.status(400).json({message:"There is no reviews to show"})
    }
    res.status(200).json({findReviews})
  }catch(error){
    return res.status(500).json({message:"there is a databse or server error", error:error.message})
  }
})


router.get("/:_id", async (req,res)=>{
  try {
    const reviewId = req.params._id
    if(!reviewId){
      return res.status(400).json({message:"No Id was provided"})
    }
    const findReview = await reviewModel.findById(reviewId)
    return res.status(200).json({findReview})

  } catch (error) {
   console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
})

router.get("/rating/:_id", async (req, res) => {
  try {
    const reviewId = req.params._id;
    console.log("Review ID:", reviewId);

    if (!reviewId) {
      return res.status(400).json({ message: "No Id was provided" });
    }

    const findReview = await reviewModel.findById(reviewId);

    if (!findReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({
      message: `This is the rating: ${findReview.rating} `,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error" });
  }
});





router.get('/movies/:id/', async (req, res) => {
  const movieId = req.params.id;

  try {
    const reviews = await reviewModel.find({ movieId })
      .populate('userId', 'username') 
      .populate('movieId', 'title gener')
      .exec();

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this movie.' });
    }
    const filterreview = reviews.map(review=> ({
      username: review.userId.username,
      comment: review.comment
    }))
    res.status(200).json({ filterreview });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post("/movies/:id", async (req, res) => {
    const movieId = req.params.id;
    const { userId, rating, comment } = req.body;
    
    try {
        // Check if the movie exists
        const movie = await movieModel.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        
        // Check if the user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Create a new review
        const newReview = new reviewModel({

            movieId,
            userId,
            rating,
            comment
        }
        );
        
        // Save the review to the database
        await newReview.save();
        
        // Return a response with the created review
        res.status(201).json({
            message: "Review added successfully",
            review: newReview,
        });
        
} catch (error) {
  console.error("🔥 SERVERFEL:", error); // detta loggar till terminalen
  res.status(500).json({
    message: "Server error",
    error: error.message, // detta skickas till klienten
    stack: error.stack    // valfritt: för att se exakt var felet sker
  });
}

});

router.put("/:_id",async (req,res)=>{
  try {
    const{rating,comment}= req.body
    if(!rating && !comment){
      return res.status(400).json({message: "you have to provide atlest rating or comment"})
    }
    
    const updatedValues = {}
    if(rating) updatedValues.rating = rating
    if(comment
    ) updatedValues.comment = comment
    
    const updateReview  = await reviewModel.findByIdAndUpdate(
      req.params._id,
      updatedValues
    )
    if(!updateReview){
      return res.status(400).json({message:"Someting went wrong with the update"})
    }
    console.log(comment)
    res.status(200).json({succes:true,message:"New updated values",updatedValues})

  } catch (error) {
    console.error("🔥 SERVERFEL:", error); 
  res.status(500).json({
    message: "Server error",
    error: error.message, 
    stack: error.stack   
  });
  }
})

router.delete("/reviews/:_id" ,async (req,res)=>{
  try {
    const reviewId = await reviewModel.findByIdAndDelete(req.params._id)
    
    if(!reviewId){
      return res.status(400).json({message:"Can not find any id"})
    }

    res.status(200).json({sucess:true,
      message:"Deleted review "
    })

  } catch (error) {
      console.error("🔥 SERVERFEL:", error); 
  res.status(500).json({
    message: "Server error",
    error: error.message, 
    stack: error.stack   
  });
  }
})

// router.delete("/:id",)
export default router