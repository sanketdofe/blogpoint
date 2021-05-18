import express from 'express';
import {addUser, authenticateUser, getUserDetails, updateUserDetails, updateUserPassword} from '../controllers/userControllers.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/adduser", addUser);
router.post("/authenticate", authenticateUser);
router.get("/getuser", auth, getUserDetails);
router.put("/updateuser", auth, updateUserDetails);
router.put("/updatepassword", auth, updateUserPassword);

export default router;