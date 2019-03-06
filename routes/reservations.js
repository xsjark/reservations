var express = require('express');
var router = express.Router();

var reservation_controller = require('../controllers/reservationController');

router.get('/', reservation_controller.reservation_list);
router.get('/create', reservation_controller.reservation_create_get)
router.post('/create', reservation_controller.reservation_create_post);

router.get('/find_rooms_form', reservation_controller.reservation_find_form_get)
router.post('/find_rooms_form/results/', reservation_controller.reservation_find_form_post)
router.post('/find_rooms_form/results/:arrival/:departure', reservation_controller.reservation_find_form_post_create)

router.post('/delete_reservation/:id', reservation_controller.reservation_delete)

router.get('/modify_reservation/:id', reservation_controller.reservation_modify_get)
router.post('/modify_reservation/:id/results', reservation_controller.reservation_modify_post)
router.post('/modify_reservation/:id/results/:arrival/:departure', reservation_controller.reservation_modify_post_create)
module.exports = router;
