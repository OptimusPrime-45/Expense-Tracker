import jwt from "jsonwebtoken"
import User from "../models/User.js"

const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token's payload and attach it to request object
            // Exclude password from user object (decoded.id matches the 'id' field we sign in the token)
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error(error)
            return res.status(401).json({ message: "Unauthorized, token failed" })
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token" })
    }
}

export { protect };
export default protect;