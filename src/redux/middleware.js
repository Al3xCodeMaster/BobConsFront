import {  success_login_empleado, error_login_empleado } from './actions';

const middleware = store => next => action => {
    switch (action.type) {
        default:
            next(action);
    }
}
export default middleware;