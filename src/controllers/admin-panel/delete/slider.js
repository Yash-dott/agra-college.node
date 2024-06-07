const { deleteRouter } = require('../../../routes/apiRouter')
const { validate } = require('../../../helpers/validations');
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { body } = require("express-validator");
const { Slider, Log } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')



const deleteSlider = async (req, res) => {
    const { id } = req.body
    const tokenData = req.response.user

    let slider = await Slider.destroy({ where: { id } })
    if (slider) {
        Log.create({ logTypeId: tokenData.logTypeId, description: `Slider Successfully Deleted By ${tokenData.name}`, createdBy: tokenData.id })
        res.json(success('Slider deleted'))
    } else {
        res.json(error('Slider does not exist'))
    }
}

deleteRouter.post('/admin/slider', authMiddleware(), validate([
    body('id').notEmpty().withMessage('Id is Required'),
]), wrapRequestHandler(deleteSlider))