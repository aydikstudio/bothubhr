import { PrismaClient, Users } from '@prisma/client'
import { AuthDto, UserDto } from './main.dto';
import { hash, verify } from 'argon2';
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const prisma = new PrismaClient()

// const transporter = nodemailer.createTransport({
//     host: process.env.NODEMAILER_HOST,
//     port: process.env.NODEMAILER_PORT,
//     secure: false, 
//     auth: {
//       user: process.env.NODEMAILER_USER,
//       pass: process.env.NODEMAILER_PASS,
//     },
//   });

const generateAccessToken = (id:number, role:string) => {
    const payload = {
        id,
        role
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '24h'})
}

class authController {

    async addBasket(req:any, res:any) {
        const {title, author, genres} = req.body;
        
   

        try {
            const book = await prisma.books.create({
                data: {
                    title,
                    author,
                    genres
                }
               })

               res.send({
                id: book.id,
                title: book.title,
           })
               
        } catch(e) {
            console.log(e)
            res.status(400).json({message: 'Not Adding Book'});
        }
    }


    async updateBook(req:any, res:any) {
        const {title, author, genres} = req.body;

        try {
            let book =  await prisma.books.update({
                where: {
                    id:  parseInt(req.params.id)
                },
                data: {
                    title,
                        author,
                        genres
                }
            })
    
            res.send({
                id: book.id,
                title: book.title,
           })
        } catch(e) {
            res.status(400).json({message: 'Not updated book'});
        }
       
    }



    async updateUsers(req:any, res:any) {
        const {id, role} = req.body;

        try {
            let user =  await prisma.users.update({
                where: {
                    id:  parseInt(req.params.id)
                },
                data: {
                    role
                }
            })
    
            res.send({
                id: user.id,
                role: user.role,
           })
        } catch(e) {
            res.status(400).json({message: 'Not updated book'});
        }
       
    }

    async deleteBook(req:any, res:any) {
   
        
        try {
      
            let book =  await prisma.books.delete({
                where: {
                    id: parseInt(req.params.id)
                },
            })

            res.json('delete');
               
        } catch(e) {
            res.status(400).json({message: 'Not Adding Genre'});
        }

    }


    async addGenre(req:any, res:any) {
        const { name } = req.body;
        
        try {
            const genre = await prisma.genres.create({
                data: {
                    name
                }
               })

               res.send({
                id: genre.id,
                name: genre.name,
           })
               
        } catch(e) {
            res.status(400).json({message: 'Not Adding Genre'});
        }

    }

    async registration(req:any, res:any) {
        const {email, name, password} = req.body;
        try {
            const oldUser = await prisma.users.findUnique({
                where: {
                    email
                }
               })
        
               if(oldUser) console.log('User already exists')
        
               const user = await prisma.users.create({
                data: {
                    email,
                    name,
                    password: await hash(password),
                    confirmation: false,
                    role: 'USER'
                }
               })

            //   await transporter.sendMail({
            //     from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', 
            //     to: email,
            //     subject: "Hello ✔", 
            //     text: "Hello world?",
            //     html: '<a href="/confirmation?id='+user.id+'">Hello world?</b>', 
            //   });

               res.send({
                    id: user.id,
                    email: user.email,
                    name: user.name,
               })
        } catch(e) {
      
            res.status(400).json({message: 'Registration error'});
        }
    }

    async login(req:any, res:any) {
        const {email, password} = req.body;
        
       try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if(!user) res.status(400).json({message: `user not`})

        const isValid = await verify(user!.password, password);
        if(!isValid) res.status(400).json({message: `Invalid password`})
            const token = generateAccessToken(user!.id, user!.role);
            res.json({
                user,
                token
               })
        } catch(e) {
            res.status(400).json({message: 'Login error'});
        } 
    }

    async getUsers(req:any, res:any) {
        try {
            const users = await prisma.users.findMany()
      
            res.json(users)
          
        } catch(e) {
            res.status(400).json({message: 'Users error'});
        }
    }


    async getBooks(req:any, res:any) {
        try {
            const books = await prisma.books.findMany()
      
            res.json(books)
          
        } catch(e) {
            res.status(400).json({message: 'books error'});
        }
    }


    async getBookOne(req:any, res:any) {


   
        try {
            const book = await prisma.books.findUnique({
                where: {
                    id: parseInt(req.params.id)
                },
            })
    
            if(!book) {
                throw new Error('Book not found')
            }
    
            res.json(book);
          
       
    } catch(e) {
     
        res.status(400).json({message: 'book error'});
    }
}

}

module.exports = new authController();