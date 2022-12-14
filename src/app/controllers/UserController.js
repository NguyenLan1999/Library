const User = require('../models/user');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken')

class UserController{

    getLogin(req, res, next){
        res.render('user/login');
    }

    postLogin(req, res, next){
        
        const username = req.body.username;
        const password =req.body.password;

        if(!username && ! password){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Tên đăng nhập và mật khẩu không được để trống!!!!'
            }
            res.redirect('back');
        }

        if(!username || !password){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Vui lòng nhập tên đăng nhập !!!!'
            }
            res.redirect('back');

        }

        User.findOne({
            username: username,
            password: password
        })
        .then((user)=>{
            if(user){
               var token = jwt.sign({
                _id: user._id
               }, 'mk')
               console.log(token)
                res.cookie('token', token, { signed: true });
                req.session.message ={
                    type: 'success',
                    intro: 'Thông báo!',
                    message: 'Bạn đã đăng nhập thành công!!!!'
                    }
                res.redirect('/');
            }else{
                req.session.message ={
                    type: 'danger',
                    intro: 'Lỗi!',
                    message: 'Tên đăng nhập hoặc mật khẩu không chính xác !!!!'
                    }
                res.redirect('back');
            }
        })
        
    }
    
    getRegister(req, res, next){
        res.render('user/register');
    }
    postRegister(req, res, next){

        const username = req.body.username;
        const password = req.body.password;
        const email = req.body.email;

        if(!username && !password && !email){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Vui lòng điền đầy đủ thông tin!!!!'
            }
            res.redirect('back');
        }
        if(!username || !password || !email){
            req.session.message ={
                type: 'danger',
                intro: 'Lỗi!',
                message: 'Tên đăng nhâp, email không được để trống!!!!!!!'
            }
            res.redirect('back');
        }

        User.findOne({email: email})
        .then((user)=>{
            if(user){
                req.session.message ={
                    type: 'danger',
                    intro: 'Lỗi!',
                    message: 'Email này đã được sử dụng!!!!!!!'
                }
                res.redirect('back')
            }else{
                return User.create({
                    username: username,
                    password: password,
                    email: email,
               })
               .then((user)=>{
                var token = jwt.sign({
                    _id: user._id
                   }, 'mk')
                   console.log(token)
                    res.cookie('token', token, { signed: true });
                req.session.message ={
                    type: 'success',
                    intro: 'Thông báo!',
                    message: 'Bạn đã đăng ký thành công!!!!'
                }
                res.redirect('/');
               })

            }
           
        })
    }

    view(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        User.findById(data._id)
        .then(user=>{
            res.render('user/view', {user : mongooseToObject(user), data: data})
        })
        .catch(next)
        
    }
    edit(req, res,next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        User.findById(data._id)
        .then(user=>{
            res.render('user/edit', {
                user: mongooseToObject(user),
                data: data})

        })
        .catch(next)
    }

    postEdit(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
    
        const username = req.body.username
        const phone = req.body.phone
        const address = req.body.address
        const history = req. body.history

        if(!username){
            req.session.message ={
                type: 'danger',
                intro: 'Thông báo lỗi!',
                message: 'Tên đăng nhập không được để trống!!!!'
            }
            res.redirect('back')
        }
        if(!(phone.length === 10)){
            req.session.message ={
                type: 'danger',
                intro: 'Thông báo lỗi!',
                message: 'Vui lòng nhập lại số điện thoại!!!!'
            }
            res.redirect('back')
        }

        User.findByIdAndUpdate(data._id, {
            username: username,
            phone: phone,
            address: address,
            history: history
        })
        .then(()=>{
            req.session.message ={
                type: 'success',
                intro: 'Thông báo!',
                message: 'Thông tin cá nhân được cập nhật thành công!!!!'
            }
            res.redirect('/user/view')
        })
        .catch(next)
    }

    logout(req, res, next){
        const token = req.signedCookies.token;
        res.clearCookie('token');
        res.redirect('/')
    }
}



module.exports = new UserController();