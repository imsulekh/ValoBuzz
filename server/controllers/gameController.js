require('../models/database');
const Blog = require('../models/Blog');
const { all } = require('../routes/gameRoutes');


const agents_url = "https://valorant-api.com/v1/agents";
const maps_url = "https://valorant-api.com/v1/maps";
var allAgentsData, allMapsData;
async function getAgentDetails() {
    const response = await fetch(agents_url);
    var data = await response.json();
    allAgentsData = data.data;
   
}
async function geMapDetails() {
    const response = await fetch(maps_url);
    var data = await response.json();
    allMapsData = data.data;
   
}
getAgentDetails();
geMapDetails();



exports.homepage = async(req, res) => {
    try {
        const limitNumber = 5;
        var agentData = [], mapData = [];
        const blogs = await Blog.find({}).sort({_id: -1}).limit(limitNumber);

        const patchNotes = await Blog.find({'category': 'Patch Notes'}).limit(limitNumber);
        const tipsAndTricks = await Blog.find({'category': 'Tips and Tricks'}).limit(limitNumber);
        const tutorial = await Blog.find({'category': 'Tutorial'}).limit(limitNumber);
        const bugs = await Blog.find({'category': 'Bugs'}).limit(limitNumber);
        const gameplay = await Blog.find({'category': 'Gameplay'}).limit(limitNumber);
        const review = await Blog.find({'category': 'Review'}).limit(limitNumber);

        const data = { blogs, patchNotes, tipsAndTricks, tutorial, bugs, gameplay, review };


        for(let count = 0; count <= limitNumber; ++count) {
            agentData.push(allAgentsData[count]);
            mapData.push(allMapsData[count]);
        }

        const agents = agentData;
        const maps = mapData;
        res.render('index', { title: 'Gaming Blog - Home', agents, maps, data});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
    
}

exports.exploreAgents = async(req, res) => {
    try {
        const elements = allAgentsData;
        res.render('agents', { title: 'ValoBuzz - Agents', elements});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
    
}


exports.exploreMaps = async(req, res) => {
    try {
        const elements = allMapsData;
        res.render('maps', { title: 'ValoBuzz - Maps', elements});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
    
}


exports.blog = async(req, res) => {
    try {
        let blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        res.render('blogs', { title: 'ValoBuzz - Blogs', blog});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
}

exports.agent = async(req, res) => {
    try {
        let agentID = req.params.id;
        var agentData;  
        allAgentsData.forEach(element => {
            if(element.uuid === agentID) agentData = element;
        });
        res.render('agent', { title: 'ValoBuzz - Agents', agentData});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
}

exports.map = async(req, res) => {
    try {
        let mapID = req.params.id;
        var mapData;
        allMapsData.forEach(element => {
            if(element.uuid === mapID) mapData = element;
        });
        console.log(mapData);
    
        res.render('map', { title: 'ValoBuzz - Maps', mapData});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
}



exports.searchBlogs = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let blogs = await Blog.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'ValoBuzz - Search', blogs });
    } catch(error) {
        res.status(500).send({message: error.message || "Error Occurred" });
    }
    
}

exports.exploreLatest = async(req, res) => {
    try {
        const blogs = await Blog.find({}).sort({_id: -1});
        res.render('explore-latest', { title: 'ValoBuzz - Blogs', blogs });
    } catch (error) {
        res.status(500).send({message: error.message || "Error occurred"});
    } 
}



exports.submitBlog = async(req, res) => {
    const infoErrorObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-blog', { title: 'ValoBuzz - Submit Blog', infoErrorObj, infoSubmitObj });
}

exports.submitBlogOnPost = async(req, res) => {

    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0) {
            console.log("No Files where uploaded.");
        } else {

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
            console.log(newImageName);

            imageUploadFile.mv(uploadPath, function(err) {
                if(err) return res.status(500).send(err);
            });
        }

        const newBlog = new Blog({
            blogTitle: req.body.blogTitle,
            description: req.body.description,
            email: req.body.email,
            category: req.body.category,
            image: newImageName
        });
       await newBlog.save();

        req.flash('infoSubmit', 'Blog has been published successfully.');
        res.redirect('/submit-blog');
    } catch(error) {
        req.flash('infoErrors', error);
        res.redirect('/submit-blog');
    }

    
    
}



// exports.exploreBlogs = async(req, res) => {
//     try {
//         const limit = 5;
//         const blogs = await Blog.find({}).limitNumber(limit);
//         res.render('blogs', {title: 'ValoBuzz : Blogs', blogs});
//     } catch (error) {
//         res.status(500).send({message: error.message || "Error Occured" });
//     }
// }



// exports.exploreCategories = async(req, res) => {
//     try {
//         const limitNumber = 20;
//         const categories = await Category.find({}).limit(limitNumber);
//         res.render('categories', { title: 'Gaming Blog - Categories', categories});
//     } catch (error) {
//         res.status(500).send({message: error.message || "Error Occurred" });
//     }
    
// }




// async function insertDummyBlogs() {
//     try {
//         await Blog.insertMany([
//             {
//                 "blogTitle": "Viper Agent Review",
//                 "description": "The American chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy's vision. If the toxins don't kill her prey, her mind games surely will. Sabine Callas hails from the United States, with possible links to Seattle. Holding a doctorate and awards such as the R. Francis Prize and the Denton Outstanding Innovation Award, her previous occupations include roles with Kingdom Corporation, eventually becoming its first Chief Scientific Officer on the board of advisors, and influence over the conglomerate's ventures in Rabat, Morocco. At some point during her time there however, there was an incident. Little is known about what happened, but everything changed for Callas at that point after all she lost because of it, leading her to isolate and dedicate herself to pursuing vengeance instead. After the events of First Light, the secretive VALORANT Protocol was founded, with Callas being one of its founders and becoming its second agent, Viper, and second-in-command to Brimstone. One of its most active members as well as most experienced, Viper is involved with the recruitment of new agents and is active in many of their missions.",
//                 "email": "testaccount@xyz.com",
//                 "category": "Review",
//                 "image": "sage.jpeg"
//             },
//             {
//                 "blogTitle": "Viper Agent Review",
//                 "description": "The American chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy's vision. If the toxins don't kill her prey, her mind games surely will. Sabine Callas hails from the United States, with possible links to Seattle. Holding a doctorate and awards such as the R. Francis Prize and the Denton Outstanding Innovation Award, her previous occupations include roles with Kingdom Corporation, eventually becoming its first Chief Scientific Officer on the board of advisors, and influence over the conglomerate's ventures in Rabat, Morocco. At some point during her time there however, there was an incident. Little is known about what happened, but everything changed for Callas at that point after all she lost because of it, leading her to isolate and dedicate herself to pursuing vengeance instead. After the events of First Light, the secretive VALORANT Protocol was founded, with Callas being one of its founders and becoming its second agent, Viper, and second-in-command to Brimstone. One of its most active members as well as most experienced, Viper is involved with the recruitment of new agents and is active in many of their missions.",
//                 "email": "testaccount@xyz.com",
//                 "category": "Review",
//                 "image": "phoenix.jpeg"
//             },
//             {
//                 "blogTitle": "Viper Agent Review",
//                 "description": "The American chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy's vision. If the toxins don't kill her prey, her mind games surely will. Sabine Callas hails from the United States, with possible links to Seattle. Holding a doctorate and awards such as the R. Francis Prize and the Denton Outstanding Innovation Award, her previous occupations include roles with Kingdom Corporation, eventually becoming its first Chief Scientific Officer on the board of advisors, and influence over the conglomerate's ventures in Rabat, Morocco. At some point during her time there however, there was an incident. Little is known about what happened, but everything changed for Callas at that point after all she lost because of it, leading her to isolate and dedicate herself to pursuing vengeance instead. After the events of First Light, the secretive VALORANT Protocol was founded, with Callas being one of its founders and becoming its second agent, Viper, and second-in-command to Brimstone. One of its most active members as well as most experienced, Viper is involved with the recruitment of new agents and is active in many of their missions.",
//                 "email": "testaccount@xyz.com",
//                 "category": "Review",
//                 "image": "omen.jpeg"            
//             },
//             {
//                 "blogTitle": "Viper Agent Review",
//                 "description": "The American chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy's vision. If the toxins don't kill her prey, her mind games surely will. Sabine Callas hails from the United States, with possible links to Seattle. Holding a doctorate and awards such as the R. Francis Prize and the Denton Outstanding Innovation Award, her previous occupations include roles with Kingdom Corporation, eventually becoming its first Chief Scientific Officer on the board of advisors, and influence over the conglomerate's ventures in Rabat, Morocco. At some point during her time there however, there was an incident. Little is known about what happened, but everything changed for Callas at that point after all she lost because of it, leading her to isolate and dedicate herself to pursuing vengeance instead. After the events of First Light, the secretive VALORANT Protocol was founded, with Callas being one of its founders and becoming its second agent, Viper, and second-in-command to Brimstone. One of its most active members as well as most experienced, Viper is involved with the recruitment of new agents and is active in many of their missions.",
//                 "email": "testaccount@xyz.com",
//                 "category": "Review",
//                 "image": "fade.jpeg"            
//             },
//             {
//                 "blogTitle": "Viper Agent Review",
//                 "description": "The American chemist, Viper deploys an array of poisonous chemical devices to control the battlefield and choke the enemy's vision. If the toxins don't kill her prey, her mind games surely will. Sabine Callas hails from the United States, with possible links to Seattle. Holding a doctorate and awards such as the R. Francis Prize and the Denton Outstanding Innovation Award, her previous occupations include roles with Kingdom Corporation, eventually becoming its first Chief Scientific Officer on the board of advisors, and influence over the conglomerate's ventures in Rabat, Morocco. At some point during her time there however, there was an incident. Little is known about what happened, but everything changed for Callas at that point after all she lost because of it, leading her to isolate and dedicate herself to pursuing vengeance instead. After the events of First Light, the secretive VALORANT Protocol was founded, with Callas being one of its founders and becoming its second agent, Viper, and second-in-command to Brimstone. One of its most active members as well as most experienced, Viper is involved with the recruitment of new agents and is active in many of their missions.",
//                 "email": "testaccount@xyz.com",
//                 "category": "Review",
//                 "image": "reyna.jpeg"            
//             }
//         ]);
//     } catch(error) {
//         console.log('err', + error);
//     }
// }
// insertDummyBlogs();










// async function insertDummyCategoryData() {
//     try {
//         console.log(agentDetails);
//         await Category.insertMany(agentDetails);
//     } catch (error) {
//         console.log('err', + error);
//     }
// }

// insertDummyCategoryData();