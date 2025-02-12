import passport from 'passport';
import Usuario from '../models/Usuario.js';

class UsuarioController{
    login = (req, res, next) => {
        passport.authenticate('local', {
            successRedirect: '/admin',
            failureRedirect: '/usuario/login',
            failureFlash: true
        })(req, res, next)
    }

    logout = (req, res,  next) => {
        req.logout((err) => {
            res.redirect('/usuario/login')
        })
    }
}

export default new UsuarioController()
