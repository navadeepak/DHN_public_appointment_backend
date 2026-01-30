import User from "../models/user.model.js";

export const getTargetedUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    res.status(200).json({ message: "successfully fetch data", data: data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updateData = req.body;
    const data = await User.findByIdAndUpdate(req.params.id, updateData);
    res.status(200).json({ message: "user successfully updated!", data: data });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
