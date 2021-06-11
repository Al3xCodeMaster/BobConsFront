export const ERROR_LOGIN = 'ERROR_LOGIN';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';
export const SET_COORDINATES = 'SET_COORDINATES';
export const SET_DATE = 'SET_DATE';
export const SET_ID = 'SET_ID';
export const SET_NOMBRE = 'SET_NOMBRE';
export const SET_APELLIDO = 'SET_APELLIDO';
export const SET_CELULAR = 'SET_CELULAR';
export const SET_CORREO = 'SET_CORREO';
export const SET_CONTRASENHA = 'SET_CONTRASENHA';
export const SET_SERVICIOS = 'SET_SERVICIOS';
export const SUBIO_FOTO = 'SUBIO_FOTO';
export const SET_NAVBAR = 'SET_NAVBAR';
export const SET_ADDRESS = 'SET_ADDRESS';
export const SET_TYPE_ID = 'SET_TYPE_ID';
export const SET_SEX = 'SET_SEX';
export const SUCESS_LOGIN_CLIENT = 'SUCESS_LOGIN_CLIENT';
export const ERROR_LOGIN_CLIENT = 'ERROR_LOGIN_CLIENT';
export const SET_REPEAT_CONTRASENHA = 'SET_REPEAT_CONTRASENHA';
export const SAVE_PRODUCTS = 'SAVE_PRODUCTS';
export const CHANGE_RESTAURANT = 'CHANGE_RESTAURANT';
export const SET_LOG_OUT = 'SET_LOG_OUT';
export const SAVE_BILL = 'SAVE_BILL';
//******************LOGIN*******************
export const success_login = (payload,status) => {
    return {
        type: SUCCESS_LOGIN,
        payload,
        status
    }
}
//*****************GET PREVIEW **************/
export const save_products = (payload) => {
    return {
        type: SAVE_PRODUCTS,
        payload
    }
}
export const change_restaurant = (payload) => {
    return {
        type: CHANGE_RESTAURANT,
        payload
    }
}

export const error_login = payload => {
    return {
        type: ERROR_LOGIN,
        payload
    }
}

export const success_login_client = (payload,status) => {
    return {
        type: SUCESS_LOGIN_CLIENT,
        payload,
        status
    }
}
export const error_login_client = payload => {
    return {
        type: ERROR_LOGIN_CLIENT,
        payload
    }
}

export const set_coordinates = payload => {
    return {
        type: SET_COORDINATES,
        payload
    }
}
export const set_date = payload => {
    return {
        type: SET_DATE,
        payload
    }
}
export const set_id = payload => {
    return {
        type: SET_ID,
        payload
    }
}
export const set_nombre = payload => {
    return {
        type: SET_NOMBRE,
        payload
    }
}
export const set_apellido = payload => {
    return {
        type: SET_APELLIDO,
        payload
    }
}
export const set_correo = payload => {
    return {
        type: SET_CORREO,
        payload
    }
}
export const set_celular = payload => {
    return {
        type: SET_CELULAR,
        payload
    }
}
export const set_contrasenha = payload => {
    return {
        type: SET_CONTRASENHA,
        payload
    }
}
export const set_servicios = payload => {
    return {
        type: SET_SERVICIOS,
        payload
    }
}
export const subio_foto = payload => {
    return {
        type: SUBIO_FOTO,
        payload
    }
}
export const set_Address = payload => {
    return {
        type: SET_ADDRESS,
        payload
    }
}
export const set_type_id = payload => {
    return {
        type: SET_TYPE_ID,
        payload
    }
}
export const set_sex = payload => {
    return {
        type: SET_SEX,
        payload
    }
}

export const set_navbar = payload => {
    return {
        type: SET_NAVBAR,
        payload
    }
}

export const set_repeat_pass = payload => {
    return {
        type: SET_REPEAT_CONTRASENHA,
        payload
    }
}

export const set_log_out = payload => {
    return {
        type: SET_LOG_OUT,
        payload
    }
}
