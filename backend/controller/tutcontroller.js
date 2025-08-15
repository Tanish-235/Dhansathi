import Tutorial from "../model/tutorial.js";

export const getTut = async (req, res) => {
    try {
        const tuts = await Tutorial.find({});
        // Return array directly for frontend compatibility
        res.status(200).json(tuts);
    } catch (error) {
        console.log("error in fetching tut", error.message);
        res.status(500).json([]);
    }
}

export const addTut = async (req, res) => {
    const tut = req.body;
    if (!tut.title || !tut.description || !tut.url) {
        return res.status(400).json({ message: "Please provide all the fields" });
    }
    const newTut = new Tutorial(tut);
    try {
        await newTut.save();
        // Return the new tutorial object directly
        res.status(200).json(newTut);
    } catch (error) {
        console.log("error in adding Tutorial: ", error.message);
        res.status(500).json({ message: "server error" });
    }
}

export const deleteTut = async (req, res) => {
    const { id } = req.params;
    try {
        await Tutorial.findByIdAndDelete(id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.log("error in deleting: ", error.message);
        res.status(500).json({ message: "Error while deleting" });
    }
}

export const updateTut = async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;

    if (!title || !description || !url) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const updated = await Tutorial.findByIdAndUpdate(
            id,
            { title, description, url },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ success: false, message: "Tutorial not found" });
        }
        res.status(200).json(updated);
    } catch (error) {
        console.log("Error updating tutorial:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

