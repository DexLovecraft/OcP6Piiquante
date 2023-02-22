const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => console.log(sauces))
        .catch(error => res.status(500).json({error}));
};

exports.getOneSauce = (req, res, next) => {
   
};

//enregistre rien 
exports.createOneSauce = (req, res, next) => {
    const sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat: req.body.heat,
        likes: 0,
        disliked: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(res.status(201).json({message : "Sauce créé"}))
        .catch(error => res.status(500).json({error}));
};

exports.modifyOneSauce = (req, res, next) => {
   
};

exports.deleteOneSauce = (req, res, next) => {
   
};

exports.isLikeOrDislike = (req, res, next) => {

};