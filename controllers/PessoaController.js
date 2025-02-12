import Pessoa from "../models/Pessoa.js";
import {Op} from "sequelize";
import Usuario from "../models/Usuario.js";
import bcrypt from 'bcryptjs'

class PessoaController {
     index = function (req, res) {
        Pessoa.findAll({
            where:{
                status: 1
            },
            order:[['nome','asc']],
        }).then((pessoas) => {
            res.render('pessoa/index', {pessoas: pessoas});
        })
    }

    cadastrar = async function (req, res) {
        let pessoa = await Pessoa.findOne({
            where:{
                [Op.or]:[
                    {cpf: req.body.cpf},
                    {email: req.body.email}
                ]
            }
        })

        if(pessoa){
            req.flash('error_msg', 'Usuário já cadastrado!')
            res.redirect('/pessoa/cadastrar')
        }else{
            let novo = {
                nome: req.body.nome,
                telefone: req.body.telefone,
                email: req.body.email,
                cpf: req.body.cpf,
                status: 1
            }
            Pessoa.create(novo).then(function(pessoa) {
                let novoUsuario = {
                    login: pessoa.email,
                    senha: req.body.senha,
                    categoria: 0,
                    status: 1,
                    pessoa_id: pessoa.id
                }

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash) => {
                        novoUsuario.senha = hash
                        Usuario.create(novoUsuario).then(()=> {
                            req.flash('success_msg', 'Cliente cadastrado com sucesso!')
                            res.redirect('/usuario/login')
                        })
                    })
                })


                res.redirect('/pessoa')
            })
        }
    }//Fim do cadastro
}


export default new PessoaController()