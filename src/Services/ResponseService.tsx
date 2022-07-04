let _response = {
    status : "failure",
    message : "Something went wrong, please try again after sometimes",
    data : null
}


const buildSuccess = (_message,_data = null) => {
    // alert(_data)
    _response.status = "success";
    _response.message = _message;
    _response.data = _data;
    return _response;
};

const buildFailure = (_message,_data = null) => {
    _response.status = "failure";
    _response.message = _message;
    _response.data = _data;
    return _response;
};


const ResponseService = {
  buildSuccess,
  buildFailure
};

export default ResponseService;