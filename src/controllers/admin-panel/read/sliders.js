const { retrieveRouter } = require('../../../routes/apiRouter')
const { success, error } = require('../../../helpers/response')
const { wrapRequestHandler } = require('../../../helpers/response')
const { Slider } = require('../../../models')
const {authMiddleware} = require('../../../middleware/authMiddleware')
const { Op } = require('sequelize');


const readSliders = async (req, res) => {

    let sliders = await Slider.findAll({
        order: [['id', 'DESC']]
    })
    res.json(success('Successfully retrieve', sliders))
}

retrieveRouter.get('/admin/sliders', authMiddleware(), wrapRequestHandler(readSliders))