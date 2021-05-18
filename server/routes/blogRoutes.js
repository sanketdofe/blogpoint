import express from 'express';
import {addBlog, getAllBlogs, getBlogsWithType, getUserBlogs, updateBlog, softDeleteBlog, hardDeleteBlog} from '../controllers/blogControllers.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/addblog", auth, addBlog);
router.get("/getallblogs", getAllBlogs);
router.get("/getblogwithtype/:type", getBlogsWithType);
router.get("/getuserblogs", auth, getUserBlogs);
router.put("/updateblog", auth, updateBlog);
router.delete('/softdeleteblog', auth, softDeleteBlog);
router.delete('/harddeleteblog', auth, hardDeleteBlog);


export default router;