import Booking from "../models/Booking.js";
import Show from "../models/Show.js"

// Function to check the availability of selected Seats for a movie
const checkSeatsAvailabilityj = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if(!showData) {
            return false;
        }

        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatsTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatsTaken;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId,selectedSeats } = req.body;
        const { origin } = req.headers;

        // check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailabilityj(showId, selectedSeats);

        if(!isAvailable) {
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');
        
        // Created a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat) =>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // Stripe Gateway Initialize


        req.json({success: true, message: 'Booked Successfully'});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success: true, occupiedSeats});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}