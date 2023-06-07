const JWT = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const { userModel } = require("../models/userModel");

const registerController = async (req, res) => {
    try {
        const { name, username, email, password, phone, address, answer } = req.body;
        if (!name) return res.send({ error: 'Name is required' });
        if (!username) return res.send({ error: 'Username is required' });
        if (!email) return res.send({ error: 'Email is required' });
        if (!password) return res.send({ error: 'Password is required' });
        if (!phone) return res.send({ error: 'Phone is required' });
        if (!address) return res.send({ error: 'Address is required' });
        if (!answer) return res.send({ error: 'Answer is required' });

        // check existing user by email
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User already registered. Please login."
            });
        }

        // check existing user by username
        const existingUserName = await userModel.findOne({ username });
        if (existingUserName) {
            return res.status(200).send({
                success: false,
                message: "Username already registered."
            });
        }

        // register user
        const hashedPassword = await hashPassword(password);
        const user = await userModel({
            name,
            username,
            email,
            password: hashedPassword,
            phone,
            address,
            answer
        }).save();

        res.status(201).send({
            success: true,
            message: 'Registration Successfully',
            user
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        });
    }
};


// login

const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;

        // validation
        if (!username || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid username or password'
            });
        }

        // check user
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Username not registered'
            });
        }

        try {
            const match = await comparePassword(password, user.password);
            if (!match) {
                return res.status(200).send({
                    success: false,
                    message: 'Wrong Password'
                });
            }
        } catch (error) {
            return res.status(500).send({
                success: false,
                message: 'Error in Login',
                error
            });
        }

        // generate token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        });
    }
};

const testController = async (req, res) => {
    try {
        res.status(200).send({
            success: true,
            message: "Protected"
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in testController',
            error
        });
    }
};

module.exports = { registerController, loginController, testController };
