const router=require('express').Router();
const verify = require('./verifyToken');

router.get('/',verify, (req,res) => {

   //res.send(req.user);
   res.json({data: 'Logged In User Data'});

});


module.exports = router;