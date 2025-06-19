import UserModel from "../Models/UserModel.js"

//Get users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
       return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to get Users!"});
    }
}

//get user
export const getUser = async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.userId).select('-password');
        return res.status(200).json(user);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to get User!"});
    }
}

