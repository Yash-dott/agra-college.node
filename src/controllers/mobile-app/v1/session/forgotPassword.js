const {apiRouter} = require('../../../../routes/apiRouter')
const {validate} = require('../../../../helpers/validations');
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {body} = require("express-validator");
const {Student, AppUserToken, Course} = require('../../../../models')
const {generateJWT} = require('../../../../helpers/token')
const {generateBcrypt, compareBcrypt} = require('../../../../helpers/bcrypt')
const nodemailer = require("nodemailer");


const appUserLogin = async (req, res) => {
    const {studentId} = req.body;

    const student = await Student.findOne({where: {studentId}});

    if (!student) {
        return res.json(error('Student not found!'));
    }

    const password = Math.random().toString(36).slice(-8);

    const bcryptPass = await generateBcrypt(password);

    await Student.update({password: bcryptPass}, {where: {studentId}});

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'agrac408@gmail.com',
            pass: 'fojkxubscwkvmqsf'
        }
    });

     await transporter.sendMail({
        from: 'agrac408@gmail.com',
        to: student.email,
        subject: "Forgot Password",
         text: `Hello ${student.name},\n\nYour Password has been reset successfully. \n\n\n\n now your new password is ${password} to login into campus connect application.\n\nThank you,\nAgra College, Agra`,
         html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <p>Hello ${student.name},</p>
                <p>Your Password has been reset successfully.</p>
                <p>now your new password is <b>${password}</b> to login into campus connect application.</p>
                <p>Thank you,<br>Agra College, Agra</p>
            </div>
        `
    });


   return  res.json(success('Please check your registered email address!'));

}


apiRouter.post('/app/v1/student/forgotPassword', validate([
    body('studentId').notEmpty().withMessage('Student ID is Required'),
]), wrapRequestHandler(appUserLogin))