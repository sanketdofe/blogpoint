import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const auth = (req,res,next) => {
    if(req.headers.authorization === undefined || req.headers.authorization === null){
        res.status(200).send({message: 'Access token required'});
        return;
    }
    else{
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.secretkey, function(err, decoded) {
            if(err){
              // console.log(err);
              res.status(200).send(err);
            }
            else{
              res.locals.userid = decoded.userid;
              res.locals.role = decoded.role;
              next();
            }
          });
    }
}
export default auth;