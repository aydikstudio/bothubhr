const jwt = require('jsonwebtoken');

module.exports = function(req:any, res:any, next:any) {
    if(req.method === 'OPTIONS') {
        next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        
        if(!token) {
            return res.status(403).json({message: "users is not"});
        }

    
        const {role} = jwt.verify(token, process.env.JWT_SECRET);
        let hasRole = false;

        if(role == 'ADMIN') {
            hasRole = true;
        }

        if(!hasRole) {
            return res.status(403).json({message: 'У Вас нет доступа'});
        }
       
        next();
    } catch(e) {
 
        return res.status(403).json({message: 'User in no auth'});
    }
}