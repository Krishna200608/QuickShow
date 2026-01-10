import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

//API controller Function to get the user Bookings
export const getUserBookings = async (req, res) => {
	try {
		const auth = req.auth();
		const user = auth?.userId;

		if (!user) {
			return res.json({ success: false, message: "Not authenticated" });
		}

		const bookings = await Booking.find({ user })
			.populate({
				path: "show",
				populate: { path: "movie" },
			})
			.sort({ createdAt: -1 });

		res.json({ success: true, bookings });
	} catch (error) {
		console.log(error.message);
		res.json({ success: false, message: error.message });
	}
};

// API Controller function to update favorite movie in clerk user metadata
export const updateFavorite = async (req, res) => {
	try {
		const { movieId } = req.body;

		const auth = req.auth();
		const userId = auth?.userId;

		if (!userId) {
			return res.json({ success: false, message: "Not authenticated" });
		}

		const user = await clerkClient.users.getUser(userId);

		if (!user.privateMetadata.favorites) {
			user.privateMetadata.favorites = [];
		}

		if (!user.privateMetadata.favorites.includes(movieId)) {
			user.privateMetadata.favorites.push(movieId);
		} else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item != movieId);
        }

		await clerkClient.users.updateUserMetadata(userId, {
			privateMetadata: user.privateMetadata,
		});

        res.json({success: true, message: "Favorite movies updated"});
	} catch (error) {
		console.log(error.message);
		res.json({ success: false, message: error.message });
	}
};

export const getFavorites = async (req, res) => {
    try {
        const auth = req.auth();
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: "Not authenticated" });
        }

        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites;

        // Getting movies from the database
        const movies = await Movie.find({_id: {$in: favorites}});

        res.json({success: true, movies});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}
