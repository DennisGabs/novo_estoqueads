import passport from "passport-local";
import Usuario from "../models/Usuario.js";
const localStrategy = passport.Strategy
import bcrypt from "bcrypt" 
export default function(passport) {
    passport.use(new localStrategy(
        { usernameField: 'username', passwordField: 'password'},
        function(username, password, done){
            Usuario.findOne({
                where: {
                    login: username
                }
            }).then(function(usuario){
                if (!usuario){
                    return done(null, false, {message: 'Usuário não enontrado.'})
                }
                bcrypt.compare(password, usuario.senha, function(erro, iguais){
                    if(iguais){
                        return done(null, usuario)
                    } else{
                        return done(null, false, {message: 'Senha incorreta!'})
                    }
                })
            })
        }
    ))

    passport.serializeUser(function(usuario, done) {
        done(null, usuario.id)
    })

    passport.deserializeUser(function(id, done){
        Usuario.findByPk(id).then(function(usuario){
            done(null, usuario)
        })
    })
}