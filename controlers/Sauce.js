const Sauce = require('../models/Sauce');

exports.getAllSauces = (req, res, next) => {
    setTimeout(()=>{
        Sauce.find()
        .then(sauces => res.status(200).send(sauces))
        .catch(error => res.status(500).json({error}));
    }, 500);
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).send(sauce))
    .catch(error => res.status(404).json({ error }));
};

//enregistre rien 
exports.createOneSauce = (req, res, next) => {
    console.log(req.body)
    const sauce = JSON.parse(req.body.sauce);
        sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        sauce.likes = 0;
        sauce.dislikes = 0;
        sauce.usersLiked = [];
        sauce.usersDisliked = [];

    const newSauce = new Sauce(sauce);
    newSauce.save()
      .then(() => {
        res.status(201).json({ message: 'Sauce créée !' });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
};

exports.modifyOneSauce = (req, res, next) => {
    if(typeof req.file == "undefined"){
        Sauce.updateOne({_id: req.params.id}, {...req.body})
        .then(res.status(200).json({ message : "Sauce modifié !"}))
        .catch(error => res.status(400).json({ error }));
    } else {
        Sauce.updateOne({_id: req.params.id}, {...req.body, imageUrl :`${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
        .then(res.status(200).json({ message : "Sauce modifié !"}))
        .catch(error => res.status(400).json({ error }));
    }
};

exports.deleteOneSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.isLikeOrDislike = (req, res, next) => {
    console.log(req.body)
};