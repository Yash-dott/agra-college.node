const {retrieveRouter} = require('../../../../routes/apiRouter')
const {success, error} = require('../../../../helpers/response')
const {wrapRequestHandler} = require('../../../../helpers/response')
const {Book, Syllabus, Timetable} = require('../../../../models')
const {studentAppAuthMiddleware} = require('../../../../middleware/authMiddleware')
const {Op} = require('sequelize');


const homeData = async (req, res) => {

    const {courseId, type, semesterId} = req.query;

    console.log(courseId,semesterId,"===========")

    const timetable = await Timetable.findOne({
        where: {courseId, semesterId},
        attributes: ['picture']
    });


    const syllabus = await Syllabus.findOne({
        where: {courseId, semesterId},
        attributes: ['file']
    });
    console.log(timetable)

    res.json(success('', {timetable: 'time-tables/' + timetable.picture, syllabus: 'syllabus/' + syllabus.file }));
}

retrieveRouter.get('/app/v1/student/home',
    studentAppAuthMiddleware(),
    wrapRequestHandler(homeData)
)