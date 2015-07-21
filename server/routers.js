/**
* Initializing the Router essentials
**/
var express     = require('express'),
    Passport    = require('passport'),
    Auth        = require('./Components/Auth'),
    User        = require('./Controllers/UsersController'),
    Device      = require('./Controllers/DevicesController'),
    Team      = require('./Controllers/TeamsController'),
    Player      = require('./Controllers/PlayersController'),
    Match      = require('./Controllers/MatchesController'),
    Result      = require('./Controllers/ResultsController'),
    Raid      = require('./Controllers/RaidsController'),
    queryParser = require('./Components/QueryParser'),
    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty(),
    server         = express();

/** Created an instance of the express Router **/
var router = express.Router();

/** Initialize Passport.js **/
server.use(Passport.initialize());

/** ROUTER DECLARATION STARTS HERE **/

router.get('/unauthorized', function(req, res) {
  res.json({ message: "The request is Unauthorized" });
});

router.get('/', function (req, res) {
    res.json({message: 'API v. 1.0'});
});

/** USER ROUTES **/

router.route('/users')
  .post(Auth.isAuthenticated, User.postUsers)
  .get(Auth.isAuthenticated, User.getUsers);

//router.route('/users/nophotos/find')
//  .get(Auth.isAuthenticated, User.getUserWithoutPhoto);

router.route('/users/:id')
  .get(Auth.isAuthenticated, User.getUser)
  .put(Auth.isAuthenticated, User.updateUser)  // shall be used for all user edit operations, like change password, profile edit etc..
  .delete(Auth.isAuthenticated, User.deleteUser);

router.route('/users/facebook/:facebookId')
  .get(Auth.isAuthenticated, User.getUserByFbId);

router.route('/users/:userId/devices')
  .post(Auth.isAuthenticated, Device.registerDevice);

router.route('/devices')
  .get(Auth.isAuthenticated, Device.getAllDevices);




/*** Team resource ****/

router.route('/teams') // takes created as query param if needed
  .post(Auth.isAuthenticated, Team.add)
  .get(Auth.isAuthenticated, Team.getAll);


router.route('/teams/:id') // takes created as query param if needed
  .get(Auth.isAuthenticated, Team.getOne)
  //.put(Auth.isAuthenticated, Team.edit)
  .delete(Auth.isAuthenticated, Team.deleteOne)


/********** Player resource *******/

router.route('/players') // takes created as query param if needed
  .post(Auth.isAuthenticated, Player.add)
  .get(Auth.isAuthenticated, Player.getAll);


router.route('/players/:id') // takes created as query param if needed
  .get(Auth.isAuthenticated, Player.getOne)
  //.put(Auth.isAuthenticated, Player.edit)
  .delete(Auth.isAuthenticated, Player.deleteOne);

router.route('/teams/:teamId/players') // takes created as query param if needed
  .post(Auth.isAuthenticated, Player.getPlayersByTeam);


/********** Match resource ***********/

router.route('/matches') // takes created as query param if needed
  .post(Auth.isAuthenticated, Match.add)
  .get(Auth.isAuthenticated, Match.getAll);


router.route('/matches/:id') // takes created as query param if needed
  .get(Auth.isAuthenticated, Match.getOne)
  //.put(Auth.isAuthenticated, Match.edit)
  .delete(Auth.isAuthenticated, Match.deleteOne);



/************ Raid resource ****************/

router.route('/raids') // takes created as query param if needed
  .post(Auth.isAuthenticated, Raid.add)
  .get(Auth.isAuthenticated, Raid.getAll);


router.route('/raids/:id') // takes created as query param if needed
  .get(Auth.isAuthenticated, Raid.getOne)
  //.put(Auth.isAuthenticated, Raid.edit)
  .delete(Auth.isAuthenticated, Raid.deleteOne);

router.route('/matches/:teamId/raids') // takes created as query param if needed
  .post(Auth.isAuthenticated, Raid.getRaidsByMatch);



/***  TEST DIALERS ****/


router.route('/test/users/post')
  .get(User.postUserTest);

router.route('/devices/test') // takes created as query param if needed
  .get(Device.testDevice);







/** Expose router to other modules **/
module.exports = router;
