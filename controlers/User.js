const bcrypt = require('bcrypt')
const User = require('../models/User')

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email : req.body.email,
                password : hash
            });
            user.save()
                .then(res.status(201).json({ message : "Utilisateur créé" }))
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    setTimeout(() => {
        User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({ message : "paire Email/Mot de passe invalide"})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({ message : "paire Email/Mot de passe invalide"})
                    }
                    res.status(200).json({
                        userId : user._id,
                        token : 'TOKEN'
                    })
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
      }, 250)
    
};