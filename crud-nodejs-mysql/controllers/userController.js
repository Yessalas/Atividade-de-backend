const db = require('../db/connection'); 
const bcrypt = require ("bcrypt");
// CREATE 
exports.createUser = async (req, res) => {
        const { nome_usuario, email_usuario, senha_usuario } = req.body;
        const crpPassword = await bcrypt.hash(senha_usuario, 10);
        const sql = 'INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario) VALUES (?, ?, ?)';
        db.query(sql, [nome_usuario, email_usuario, crpPassword], (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).json({ id: result.insertId, nome_usuario, email_usuario });
        });
    };


// READ 
exports.getUsers = (req, res) => { 
 db.query('SELECT nome_usuario, email_usuario FROM usuarios', (err, results) => { 
    if (err) return res.status(500).send(err); 
        res.json(results); 
    }); 
}; 
// UPDATE 
exports.updateUser = (req, res) => { 
 const { id } = req.params; 
 const { nome_usuario, email_usuario, senha_usuario } = req.body; 
 const sql = 'UPDATE usuarios SET nome_usuario = ?, email_usuario = ? WHERE id = ?'; 
 db.query(sql, [nome_usuario, email_usuario, id], (err) => { 
    if (err) return res.status(500).send(err); 
        res.json({ id, nome_usuario, email_usuario }); 
    }); 
}; 
// DELETE 
exports.deleteUser = (req, res) => { 
 const { id } = req.params; 
 const sql = 'DELETE FROM usuarios WHERE id = ?'; 
 db.query(sql, [id], (err) => { 
    if (err) return res.status(500).send(err); 
        res.json({ message: `Usuário com ID ${id} deletado` }); 
    }); 
};


//LOGIN
exports.loginUser = (req, res)=>{
    db.query("select * from usuarios where nome_usuario =?",req.body.nome_usuario,(error,result)=>{
        if(error){
            return res.status(500).send({msg:`Erro ao tentar logar ${error}`});
        }else if(result[0]==null){
            return res.status(400).send({msg:`Usuario ou senha não existe`});
        }
        else{
            bcrypt.compare(req.body.senha_usuario,result[0].senha_usuario).then((igual)=>{
                if(!igual){
                    return res.status(400).send({msg:`Usario ou senha não existe`});
                }
                else{
                    res.status(200).send({msg:`Usuario logado`});
                }
            }).catch((error)=>res.status(500).send({msg:`Usuario ou senha não existe`}))
        }
    })
};