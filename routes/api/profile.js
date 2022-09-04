const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { body, validationResult } = require('express-validator');



// @route   GET api/profile/me
// @desc    Get current user profile
// @access  Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ errors: [{ msg: 'There is no profile for this user' }] });
        }

        res.json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ errors: [{ msg: "Server Error", error: err.message }] });
    }
});



// @route   POST api/profile
// @desc    Make a profile for loggined user
// @access  Private

router.post('/',
    [
        auth,
        body('department', 'Invalid Department').not().isEmpty(),
        body('year', 'Invalid Year').custom(value => {
            if (value && body('year').isInt() && value <= 5) { return true; }
            else { return false; }
        })

    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            department,
            year,
            location,
            clubs,
            bio
        } = req.body;


        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        profileFields.department = department;
        profileFields.year = year;
        if (location) profileFields.location = location;
        if (clubs) profileFields.clubs = clubs.split(',').map(value => value.trim());
        if (bio) profileFields.bio = bio;

        try {
            let profile = await Profile.findOne({ user: req.user.id });
            let user = await User.findById(req.user.id);

            if (!user) {
                throw new Error('User not Registered');
            }

            if (profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )

                return res.json(profile);
            }
            //create
            profile = new Profile(profileFields);

            await profile.save();

            return res.json(profile);

        } catch (err) {
            return res.status(500).json({ errors: [{ msg: 'Server Error', error: err.message }] });
        }
    }
);

// @route   GET api/profile
// @desc    GET all profiles
// @access  Public

router.get('/', async (req, res) => {
    try {

        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error', error: err.message }] });
    }
})


// @route   GET api/profile/user/:user_id
// @desc    GET user profile by id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {

        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

        if (!profile) return res.status(400).json({ errors: [{ msg: 'Profile not Found' }] });

        res.json(profile);

    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error', error: err.message }] });
    }
})


// @route   DELETE api/profile
// @desc    DELETE user profile and posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {

        //Remove Posts

        await Post.deleteMany({ user: req.user.id });

        //Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //Remove User
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ status: 1, msg: 'User Deleted' });

    } catch (err) {
        return res.status(500).json({ status: 0, errors: [{ msg: 'Server Error', error: err.message }] });
    }
})

module.exports = router;