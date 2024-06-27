const PostModel = require('../models/Post');

const locals = {
    title: "NodeJs Blog",
    description: "Simple Blog created with NodeJs, Express & MongoDb"
}

module.exports = {
    getAll: async (req, res) => {
        try {
            let perPage = 10;
            let page = req.query.page || 1;

            const posts = await PostModel.find({})
                .sort({ createdAt: -1 })
                .skip(perPage * (page - 1))
                .limit(perPage)
                .exec();

            const count = await PostModel.countDocuments({});
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);

            res.render('index', {
                locals,
                posts,
                current: page,
                nextPage: hasNextPage ? nextPage : null,
                currentRoute: '/'
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getById: async (req, res) => {
        try {
            let slug = req.params.id;
            console.log(req.params.id);

            const post = await PostModel.findById(slug);

            if (!post) {
                return res.redirect('/404');
            }

            res.render('post', {
                locals,
                post
            });
        } catch (error) {
            // console.log(error);
            res.status(500).json(error);
        }
    },
    getByTerm: async (req, res) => {
        try{
            let searchTerm = req.params.searchTerm;
            const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

            const post = await PostModel.find({
                $or: [
                    {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                    {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
                ]
            });

            res.json(post);
        } catch (error){
            res.status(500).json(error);
        }
    },
    add: async (req, res) => {
        try{
            const savedPost = await new PostModel(req.body).save();
            res.redirect('/');
        } catch (error){
            res.status(500).json(error);
        }
    },
    delete: async(req, res) => {
        try {
            await PostModel.deleteOne({_id: req.params.id});
            res.json({ success: true });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addComment: async (req, res) => {
        try {
            const post = await PostModel.findById(req.params.id);
            if(!post) {
                return res.status(404).json({message: "Post not found"});
            }

            let author = req.body.author;

            if(author == ''){
                author = 'Anonymous User';
            }

            const comment = {
                author: author,
                comment: req.body.comment
            };

            post.comments.push(comment);
            await post.save();

            res.redirect(`/${req.params.id}`);

        } catch (error) {
            res.status(500).json(error);
        }
    },
    getByAuthor: async (req, res) => {
        try {
            let authorName = req.params.authorName;

            if (authorName.includes('_')) {
                authorName = authorName.replace('_', ' ');
            }

            const posts = await PostModel.find({ 
                author: { $regex: new RegExp(authorName, 'i') } 
            });

            res.json(posts);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getPostData: async(req, res) => {
        const post = await PostModel.findById(req.params.id);

        res.render('edit', {
            locals,
            post
        });
    },
    updatePost: async(req, res) => {
        try {
            const data = {
                title: req.body.title,
                content: req.body.content,
                author: req.body.author
            }

            await PostModel.findByIdAndUpdate(req.params.id, data, {new: true});

            res.redirect(`/${req.params.id}`);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteComment: async (req, res) => {
        try {
            const { postId, commentId } = req.params;

            const post = await PostModel.findById(postId);

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);

            await post.save();
            // res.redirect(`/${postId}`);
        } catch (error) {
            res.status(500).json(error);
        }
    }
}