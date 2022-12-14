const Book = require('../models/book');
const Comment = require('../models/comment');
const { mongooseToObject } = require('../../util/mongoose');
const jwt = require('jsonwebtoken')

class BookController{
    show(req, res, next){
        const token = req.signedCookies.token;
        if(token){
            var data = jwt.verify(token, 'mk')
             var isTrue = true
             Book.findOne({ slug: req.params.slug })
             .populate({path: 'UserId'})
             .populate({path: 'declaim', populate: { path: 'UserId'} })
            .then((book) => {
                if(book.UserId.equals(data._id)){
                    res.render('books/show', { 
                        book: mongooseToObject(book),
                        data: data,
                        isTrue: isTrue
                    });
                }else{
                    res.render('books/show', { 
                        book: mongooseToObject(book),
                        data: data
                    });
                }
               
                
            })
            .catch(next)
        }else{
            Book.findOne({ slug: req.params.slug })
            .populate({path: 'UserId'})
             .populate({path: 'declaim', populate: { path: 'UserId'} })
            .then((book) => {
                res.render('books/show', { 
                    book: mongooseToObject(book)
                });
            })
            .catch(next)
        }
        
       

    }

     //[GET] /detailbook/create
     create(req, res, next) {
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
            res.render('books/create', {data: data})
        }

         //[POST] /detailbook/store
         store(req, res, next) {
            const token = req.signedCookies.token;
            var data = jwt.verify(token, 'mk')

            const name= req.body.name
            const author = req.body.author
            const introduce= req.body.introduce
            const description = req.body.description
            var img = req.file
    
            if(name){
                if(img){
                    img = img.path.split('\\').slice(2).join('/')
                    let book = new Book({
                        name: name,
                        author: author,
                        description: description,
                        introduce: introduce,
                        img: img,
                        UserId: data._id
                    });
                    book.save()
                        .then(() => {
                            req.session.message ={
                                type: 'success',
                                intro: 'Th??ng b??o!',
                                message: 'B??i vi???t ???? ???????c th??m th??nh c??ng!!!!'
                            }
                            res.redirect('/userhome')
                    
                        
                        })
                        .catch(error=>{
        
                        })
                }else{
                    let book = new Book({
                        name: name,
                        author: author,
                        description: description,
                        introduce: introduce,
                        UserId: data._id
                    });
                    book.save()
                        .then(() => {
                            req.session.message ={
                                type: 'success',
                                intro: 'Th??ng b??o!',
                                message: 'B??i vi???t ???? ???????c th??m th??nh c??ng!!!!'
                            }
                            res.redirect('/userhome')
                
                        })
                        .catch(error=>{
        
                        })
                }
                
                }else{
                    req.session.message ={
                        type: 'danger',
                        intro: 'Th??ng b??o l???i!',
                        message: 'Vui l??ng tr?????ng t??n s??ch kh??ng ???????c ????? tr???ng!!!!'
                    }
                    res.redirect('back')
                }
            
            
         }

    edit(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        Book.findById(req.params.id)
        .then((book)=>{
           
                res.render('books/edit', { book: mongooseToObject(book),  data: data })
        })
    }

    update(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')
        var img = req.body.img
        if(img){
            img = img.path.split('\\').slice(2).join('/')
            Book.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                author: req.body.author,
                description: req.body.description,
                introduce: req.body.introduce,
                img: img,
                UserId: data._id,
            })
                    .then(()=> {
                        req.session.message ={
                            type: 'success',
                            intro: 'Th??ng b??o!',
                            message: 'B??i vi???t ???????c c???p nh???t th??nh c??ng!!!!'
                        }
                        res.redirect('/')})
                    .catch(next)
        }else{
            
            Book.updateOne({ _id: req.params.id }, {
                name: req.body.name,
                author: req.body.author,
                description: req.body.description,
                introduce: req.body.introduce,
                UserId: data._id,
            })
                    .then(()=> {
                        req.session.message ={
                            type: 'success',
                            intro: 'Th??ng b??o!',
                            message: 'B??i vi???t ???????c c???p nh???t th??nh c??ng!!!!'
                        }
                        res.redirect('/')})
                    .catch(next)
        }


    }

    delete(req, res, next){
        const token = req.signedCookies.token;
        var data = jwt.verify(token, 'mk')

        if(data){
            Book.deleteOne({_id: req.params.id})
            .then(()=> {
                req.session.message ={
                    type: 'success',
                    intro: 'Th??ng b??o!',
                    message: 'B??i vi???t ???? ???????c x??a th??nh c??ng!!!!'
                }
                res.redirect('/')})
            .catch(next)
        
        }
    }

    commentPost(req, res, next){
        const token = req.signedCookies.token;
        const bookId = req.params.id;
        const content = req.body.content;
       
        if(token){
            var data = jwt.verify(token, 'mk')
            if(content){
                const comment = new Comment({
                    UserId: data._id,
                    content: content
                });
                comment.save((err, result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        Book.findByIdAndUpdate(req.params.id,
                             { $push:{declaim: result}}).exec()
                        res.redirect('back')
                    }
                    
                })
            }else{
                req.session.message ={
                    type: 'danger',
                    intro: 'Th??ng b??o l???i!',
                    message: 'Vui l??ng nh???p l???i b??nh lu???n!!!!'
                }
                res.redirect('back')
            }
            
        }
        else{
            req.session.message ={
                        type: 'danger',
                        intro: 'Th??ng b??o l???i!',
                        message: 'B???n c???n ????ng nh???p v??o h??? th???ng ????? th???c hi???n ch???c n??ng!!!!'
                    }
                    res.redirect('back')
        }
        


       }
      


        
       
    
}


module.exports = new BookController();