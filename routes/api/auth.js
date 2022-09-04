const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const domain = require('config').get('allowedEmailDomain');
const config = require('config');
const { body, validationResult } = require('express-validator');

const router = express.Router();
// @route   GET api/auth
// @desc    Test route
// @access  Public 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').exec();

        res.json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ errors: [{ msg: 'Server Error', error: err.message }] });
    }
});

// @route   POST api/auth
// @desc    Authenticate for user & get token
// @access  Public 

router.post('/',



    //req validators chains--------------------------------------------------------------------------
    [
        body('email', 'Invalid Email').custom(value => {

            if (value && body('email').isEmail()) {
                let parts = value.split("@");
                let domainParts = parts[1];

                return domainParts === domain;
            }
            else return false;

        }),
        body('password', 'Invalid Password').exists()
    ],


    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //array destructuring
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email: email }).exec();

            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            //Sending jwt back
            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 7200 }, (err, token) => {
                if (err) throw err;
                res.json({token});
            })
        }
        catch (err) {
            console.log(err.message);
            return res.status(500).json({ errors: [{ msg: 'Server Error', error: err.message }] });
        }

    }
);

module.exports = router;