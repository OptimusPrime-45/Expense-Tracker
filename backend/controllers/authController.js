import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Category } from "../models/Category.js"

const defaultCategories = [
    {
        name: "Food",
        icon: "food",
        color: "#F9D71C",
    },
    {
        name: "Transport",
        icon: "transport",
        color: "#F9D71C",
    },
    {
        name: "Shopping",
        icon: "shopping",
        color: "#F9D71C",
    },
    {
        name: "Entertainment",
        icon: "entertainment",
        color: "#F9D71C",
    },
    {
        name: "Health",
        icon: "health",
        color: "#F9D71C",
    },
    {
        name: "Education",
        icon: "education",
        color: "#F9D71C",
    },
    {
        name: "Salary",
        icon: "salary",
        color: "#F9D71C",
    },
    {
        name: "Bills",
        icon: "bills",
        color: "#F9D71C",
    },
]

// Register a user and create a default categories
// route POST /api/auth/register
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" })
        }

        const user = await User.create({ name, email, password});

        if (user) {
            // Create default categories for the user
            const categoriesToCreate = defaultCategories.map(cat => ({
                user: user._id,
                name: cat.name,
                icon: cat.icon,
                color: cat.color
            }));
            await Category.insertMany(categoriesToCreate);

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: user.generateToken(),
            })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });

        if (user && (await user.isPasswordCorrect(password))) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: user.generateToken(),
            })
        } else {
            res.status(401).json({ error: "Invalid credentials" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}