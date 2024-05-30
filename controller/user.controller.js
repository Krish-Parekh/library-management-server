import { User } from "../model/user.model.js";

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 })
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export { getAllUser };
