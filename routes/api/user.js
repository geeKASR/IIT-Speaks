const express = require('express');
const config = require('config');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const domain = require('config').get('allowedEmailDomain');
const { body, validationResult } = require('express-validator');

const router = express.Router();

//importing user model
const User = require('../../models/User');

// @route   POST api/user
// @desc    Test route
// @access  Public 

router.post('/',



    //req validators chains--------------------------------------------------------------------------
    [
        body('name', 'Invalid Name, Please check name-requirements').not().isEmpty(),
        body('email', 'Invalid Email, Please check email-requirements').custom(value => {

            if (value && body('email').isEmail()) {
                let parts = value.split("@");
                let domainParts = parts[1];

                return domainParts === domain;
            }
            else return false;

        }),
        body('password', 'Invalid Password, Please check password-requirements').isLength({ min: 6 })
    ],


    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //array destructuring
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email: email }).exec();

            if (user) {
                return res.status(400).json({ errors: [{ msg: "User already exists" }] });
            }

            const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

            user = new User({
                name,
                email,
                password,
                avatar
            })

            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            //Sending unique jwt back to the client
            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token) => {
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