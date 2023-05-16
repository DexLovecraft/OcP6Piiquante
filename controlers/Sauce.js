const Sauce = require('../models/Sauce');
const fs = require('fs')

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

exports.createOneSauce = (req, res, next) => {
    const parsedSauce = JSON.parse(req.body.sauce)

    if(parsedSauce.userId != req.auth.userId){
        res.status(403).json({message : 'Utilisatuer non authorisé'})
    }

    const sauce = parsedSauce;
        sauce.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

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
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){
            res.status(403).json({message : 'Modification non authorisé'})
    } else {
        if(typeof req.file == "undefined"){
            Sauce.updateOne({_id: req.params.id}, {...req.body})
            .then(res.status(200).json({ message : "Sauce modifié !"}))
            .catch(error => res.status(400).json({ error }));
        } else { 
            const sauceObject = JSON.parse(req.body.sauce);
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.updateOne({_id: req.params.id}, {name : sauceObject.name, manufacturer : sauceObject.manufacturer , description : sauceObject.description , mainPepper : sauceObject.mainPepper , heat : sauceObject.heat , imageUrl :`${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
                .then(res.status(200).json({ message : "Sauce modifié !"}))
                .catch(error => res.status(400).json({ error }))
            });   
            }
        }
    })
    .catch(error => res.status(404).json({ error }));
}


exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        if(sauce.userId != req.auth.userId){
            res.status(403).json({message : 'Suppression non authorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            });         
        }
    })
    .catch(error => res.status(404).json({ error }));
};

exports.isLikeOrDislike = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const isLike = req.body.like === 1
            const isPresentInLike = sauce.usersLiked.find(user => user == req.body.userId)
            const isPresentInDislike = sauce.usersDisliked.find(user => user == req.body.userId)
            if(req.body.like === 0) {
                if(isPresentInLike) {
                    return Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                        .then(res.status(200).json({ message : "like annulé !"}))
                        .catch(error => res.status(400).json({ error }));
                } 
                return Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
                    .then(res.status(200).json({ message : "dislike annulé!"}))
                    .catch(error => res.status(400).json({ error }));
            }
            if(isLike && isPresentInLike || !isLike && isPresentInDislike) {
                return res.status.json({message: "à déjà voté"})
            }
            if(isLike && isPresentInDislike) {
                return Sauce.updateOne({ _id: req.params.id },{$inc: {dislikes: -1, likes :1}, $pull: {usersDisliked: req.body.userId}, $push: {usersLiked: req.body.userId}})
                    .then(res.status(200).json({ message : "dislike annulé et sauce liké !"}))
                    .catch(error => res.status(400).json({ error }));
            }
            if(!isLike && isPresentInLike) {
                return Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: 1, likes: -1}, $pull: {usersLiked: req.body.userId}, $push: {usersDisliked: req.body.userId}})
                    .then(res.status(200).json({ message : "like annulé et sauce disliké !"}))
                    .catch(error => res.status(400).json({ error }));   
            }
            if(isLike) {
                return Sauce.updateOne({ _id: req.params.id }, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
                    .then(res.status(200).json({ message : "Sauce liké !"}))
                    .catch(error => res.status(400).json({ error }));
            }
            Sauce.updateOne({ _id: req.params.id }, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
                .then(res.status(200).json({ message : "Sauce disliké !"}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ message : "ca marche pas" }))
}