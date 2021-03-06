import passport from 'passport';
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy
import {models}  from '../models/db'
import {userI} from "./passportI";

passport.serializeUser((user:userI, done) => {
    if (user && user.id) {
        return done(null, user.id)
    }
    done(new Error("User or User ID not found"))

})

passport.deserializeUser((userId, done) => {
    models.User.findOne({
        where: {id: userId}
    }).then((user) => {
        if (user) {
            done(null, user)
        } else {
            done (new Error("No such user found"))
        }
    }).catch((err) => done(err))
})

passport.use(new LocalStrategy((username, password, done) => {

    models.User.findOne({
        where: {username: username}
    }).then((user) => {

        if (!user) {
            return done(null, false, {message: 'Username does not exist'})
        }

        if (user.password !== password) {
            return done(null, false, { message: 'Password is wrong' })
        }

        done(null, user)

    }).catch((err) => done(err))

}))

export default passport