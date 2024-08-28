const User = require('../model/user');

const uploadImages = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId || !req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'User ID and images are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const imagePaths = req.files.map(file => file.path);
        user.images.push(...imagePaths);
        await user.save();

        res.status(200).json({
            message: 'Images uploaded successfully',
            images: imagePaths,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { uploadImages };
