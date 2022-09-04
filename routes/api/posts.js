const express = require('express');
const auth = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer')
const path = require('path');

//code --> deleting file if BAD req
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
// --> code end


const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempPath = path.resolve(__dirname, '../../client/public/uploads');
        console.log(tempPath);
        cb(null,tempPath);
    },
    filename: function (req, file, cb) {
        let date = Date.now();
        cb(null, date + file.originalname);
    }
})

const upload = multer({ storage: storage });
const router = express.Router();


// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/',
    auth,
    upload.single('image'),
    [
        body('heading', 'Heading is required').not().isEmpty(),
        body('text', 'Text is required').not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                await unlinkAsync(req.file.path);
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await User.findById(req.user.id).select('-password');
            console.log(req.user.id);

            const newPost = new Post({
                user: req.user.id,
                heading: req.body.heading,
                text: req.body.text,
                image: req.file.filename,
                name: user.name,
                avatar: user.avatar,
                date : Date.now(),
            });


            const post = await newPost.save();

            res.json(post);
        } catch (err) {
            await unlinkAsync(req.file.path);
            return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
        }
    }
);


// @route   GET api/posts
// @desc    GET all posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});

// @route   GET api/posts/:post_id
// @desc    GET post by id
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ errors: [{ msg: 'Post not Found' }] });
        }

        res.json(post);
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});

// @route   DELETE api/posts/:post_id
// @desc    DELETE post by id
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        if (!post) {
            return res.status(404).json({ errors: [{ msg: 'Post not Found' }] });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ errors: [{ msg: 'Cannot Delete this post' }] });
        }

        await post.remove();

        res.json({ status: 1 });
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});


// @route   PUT api/posts/like/:post_id
// @desc    Like a Post
// @access  Private
router.put('/like/:post_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);

        // Check if the post has alerady been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ errors: [{ msg: "Post already Liked" }] });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        return res.json(post.likes);
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});

// @route   PUT api/posts/dislike/:post_id
// @desc    Dislike a Post
// @access  Private
router.put('/dislike/:post_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);

        // Check if the post has alerady been disliked
        if (post.dislikes.filter(dislike => dislike.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ errors: [{ msg: "Post already Disliked" }] });
        }

        post.dislikes.unshift({ user: req.user.id });

        await post.save();

        return res.json(post.dislikes);
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    UnLike a Post
// @access  Private
router.put('/unlike/:post_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);

        // Check if the post has alerady been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ errors: [{ msg: "Post hasn't been liked" }] });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        await post.save();

        return res.json(post.likes);
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});

// @route   PUT api/posts/undislike/:post_id
// @desc    UnDislike a Post
// @access  Private
router.put('/undislike/:post_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.post_id);

        // Check if the post has alerady been disliked
        if (post.dislikes.filter(dislike => dislike.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ errors: [{ msg: "Post hasn't been disliked" }] });
        }

        const removeIndex = post.dislikes.map(dislike => dislike.user.toString()).indexOf(req.user.id);

        post.dislikes.splice(removeIndex, 1);
        await post.save();

        return res.json(post.dislikes);
    } catch (err) {
        return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
    }
});

// @route   POST api/posts/comment/:post_id
// @desc    Add a comment 
// @access  Private
router.post('/comment/:post_id',
    auth,
    [
        body('text', 'Text is required').not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.post_id);

            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                date : Date.now(),
            }

            post.comments.unshift(newComment);
            await post.save();

            res.json(post.comments);
        } catch (err) {
            return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
        }
    }
);

// @route   delete api/posts/comment/:post_id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/comment/:post_id/:comment_id',
    auth,
    async (req, res) => {
        try {

            const post = await Post.findById(req.params.post_id);
            
            const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);
            
            if(post.comments[removeIndex].user.toString() !== req.user.id){
                console.log(req.user.id, post.comments[removeIndex].user.toString());
                return res.status(401).json({errors : [{msg : 'user not Autherized'}]});
            }
            
            post.comments.splice(removeIndex, 1);

            await post.save();

            res.json(post.comments);
        } catch (err) {
            return res.status(500).json({ errors: [{ msg: 'Server Error' }, { error: err.message }] })
        }
    }
);


module.exports = router;