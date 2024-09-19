
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken")

function adminJwtAuthenticateMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.json({ message: "no token provided" });
    }

    try {
        const verfied = jwt.verify(token, JWT_SECRET);
        console.log("verifying admin ", verfied);
        if (verfied.role !== 'ADMIN') {
            return res.status(403).json({ message: "Forbidden: Not an admin" });
        }
        req.user = verfied;
        next();
    } catch (error) {
        console.log(error);

    }
}





module.exports = adminJwtAuthenticateMiddleware 