import {
    SUCCESS_LOGIN,
    ERROR_LOGIN,
    SET_COORDINATES,
    SET_ID,
    SET_NOMBRE,
    SET_APELLIDO,
    SET_CELULAR,
    SET_CORREO,
    SET_CONTRASENHA,
    SET_SERVICIOS,
    SUBIO_FOTO,
    SET_NAVBAR,
    SET_ADDRESS,
    SET_DATE,
    SET_TYPE_ID,
    SET_SEX,
    SUCESS_LOGIN_CLIENT,
    ERROR_LOGIN_CLIENT,
    SET_REPEAT_CONTRASENHA,
    SAVE_PRODUCTS,
    CHANGE_RESTAURANT,
    SET_LOG_OUT
}
    from './actions';

const initialState = {
    usuario: {},
    client: {},
    restaurantID:0,
    products: [],
    message: 'Hola redux',
    cargando: false,
    coordenadas: { lat: 3.382225, lng: -76.531584 },
    address: '',
    datePick: new Date(Date.now()),
    subio_fot: null,
    nav_bar: 'principal',
};

function redux_reducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_RESTAURANT:
            return { ...state, restaurantID: action.payload};
        case SAVE_PRODUCTS:
            return { ...state, products: action.payload};
        case SUCCESS_LOGIN:
            return { ...state, usuario: {userInfo: action.payload, status: action.status}};
        case ERROR_LOGIN:
            return { ...state, usuario: action.payload };
        case SUCESS_LOGIN_CLIENT:
            return {...state, client: {clientInfo: action.payload, status: action.status}};
        case ERROR_LOGIN_CLIENT:
            return {...state, client: action.payload};        
        case SET_COORDINATES:
            return { ...state, coordenadas: action.payload };
        case SET_ID:
            return { ...state, usuario: { ...state.usuario, id: action.payload } };
        case SET_NOMBRE:
            return { ...state, usuario: { ...state.usuario, nombre: action.payload } };
        case SET_APELLIDO:
            return { ...state, usuario: { ...state.usuario, apellido: action.payload } };
        case SET_CORREO:
            return { ...state, usuario: { ...state.usuario, correo: action.payload } };
        case SET_CONTRASENHA:
            return { ...state, usuario: { ...state.usuario, contrasenha: action.payload } };
        case SET_REPEAT_CONTRASENHA:
            return { ...state, usuario: { ...state.usuario, equalContrasenha: action.payload } };    
        case SET_SERVICIOS:
            return { ...state, usuario: { ...state.usuario, servicios: action.payload } };
        case SET_CELULAR:
            return { ...state, usuario: { ...state.usuario, celular: action.payload } };
        case SUBIO_FOTO:
            return { ...state, subio_fot: action.payload }
        case SET_DATE:
            return { ...state, datePick: action.payload } 
        case SET_ADDRESS:
            return {...state, address: action.payload}
        case SET_TYPE_ID:
            return { ...state, usuario: { ...state.usuario, tipoId: action.payload }};
        case SET_SEX:
            return {...state, usuario: {...state.usuario, sex: action.payload}}    
        case SET_NAVBAR:
            return { ...state, nav_bar: action.payload}
        case SET_LOG_OUT:
            return initialState    
        default:
            return state;
    }
}
export default redux_reducer;