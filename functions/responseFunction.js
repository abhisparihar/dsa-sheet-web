module.exports = function (express) {
    global.HTTP_STATUS_CODES = {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NO_BODY: 204,
        PARTIAL_SUCCESS: 206,
        NO_MODIFIED: 304,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        UNSUPPORTED_TYPE: 415,
        LOCKED: 423,
        ILLEGAL_ACCESS: 451,
        SERVER_ERROR: 500,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        NOT_ACCEPTABLE: 406,
        LARGE_PAYLOAD: 413,
        TOO_MANY_REQUEST: 429
    }

    // Request is not acceptable as some thing is missing
    express.response.sendNotAcceptable = function (message) {
        this.status(HTTP_STATUS_CODES.NOT_ACCEPTABLE).json({
            status: HTTP_STATUS_CODES.NOT_ACCEPTABLE,
            message: message,
            messageType: 'warning'
        });
    };
    // Not able to connect third party service or other service.
    express.response.sendBadGateway = function (message) {
        this.status(HTTP_STATUS_CODES.BAD_GATEWAY).json({
            status: HTTP_STATUS_CODES.BAD_GATEWAY,
            message: message
        });
    };
    //Too many Request 
    express.response.sendTooManyRequest = function (message) {
        this.status(HTTP_STATUS_CODES.TOO_MANY_REQUEST).json({
            status: HTTP_STATUS_CODES.TOO_MANY_REQUEST,
            message: message
        });
    };

    // For send data, message
    express.response.sendSuccess = function (data = {}, customMessage) {
        this.status(HTTP_STATUS_CODES.OK).send({
            status: HTTP_STATUS_CODES.OK,
            data: data,
            message: customMessage || undefined
        });
    };
    // For send data, message
    express.response.sendInvalidIdForList = function (customMessage) {
        this.status(HTTP_STATUS_CODES.OK).send({
            status: HTTP_STATUS_CODES.OK,
            data: { list: [], recordsTotal: 0, recordsFiltered: 0 },
            message: customMessage || undefined
        });
    };
    // Duplicate, Already identity available
    express.response.sendDuplicate = function (message) {
        this.status(HTTP_STATUS_CODES.CONFLICT).send({
            status: HTTP_STATUS_CODES.CONFLICT,
            message: message
        });
    };
    // 200 = Resource exists, 404 = Resource does not exit
    express.response.sendIsExists = function (response) {
        const code = response ? HTTP_STATUS_CODES.OK : HTTP_STATUS_CODES.NOT_FOUND;

        this.status(code).send();
    };
    // Resource Created
    express.response.sendCreated = function (message, data = {}) {
        this.status(HTTP_STATUS_CODES.CREATED).json({
            status: HTTP_STATUS_CODES.CREATED,
            data: data,
            message: message
        });
    };
    // Update, delete request accepted
    express.response.sendUpdated = function (message, data = {}) {
        this.status(HTTP_STATUS_CODES.ACCEPTED).json({
            status: HTTP_STATUS_CODES.ACCEPTED,
            data: data,
            message: message
        });
    };
    // Update, delete request accepted
    express.response.sendDeleted = function (message) {
        this.status(HTTP_STATUS_CODES.ACCEPTED).json({
            status: HTTP_STATUS_CODES.ACCEPTED,
            message: message
        });
    };
    // Validation failed
    express.response.sendInvalidRequest = function (message) {
        this.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            status: HTTP_STATUS_CODES.BAD_REQUEST,
            message: message
        });
    };
    // We've set code 200 to send response message in body, 
    express.response.sendMessage = function (title, message) {
        // No content
        this.status(HTTP_STATUS_CODES.OK).json({
            status: HTTP_STATUS_CODES.NO_BODY,
            messageOnly: true,
            title: title,
            message: message
        });
    };
    // URL, Route, Page not found
    express.response.sendResourceNotFound = function (message) {
        this.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            status: HTTP_STATUS_CODES.NOT_FOUND,
            message: message
        });
    };
    // URL, Route, Page not found
    express.response.resourceNotFound = function (data, message) {
        this.status(HTTP_STATUS_CODES.NOT_FOUND).json({
            status: HTTP_STATUS_CODES.NOT_FOUND,
            data: data,
            message: message
        });
    };
    // Access without login/Unauthenticate
    express.response.sendLogin = function (message) {
        this.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODES.UNAUTHORIZED,
            title: "Login Failed",
            message: message || "You are not authorize to access."
        });
    };
    // Access without login/Unauthenticate
    express.response.tokenNotValid = function (message) {
        this.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            status: HTTP_STATUS_CODES.UNAUTHORIZED,
            title: "Token not valid",
            tokenExpired: true,
            message: message || "Your session has expired. Please log in again to continue"
        });
    };
    // Forbidden
    express.response.sendUnauthorized = function (message) {
        this.status(HTTP_STATUS_CODES.FORBIDDEN).json({
            status: HTTP_STATUS_CODES.FORBIDDEN,
            message: message || "You are not allowed to access."
        });
    };

    // eslint-disable-next-line complexity
    express.response.sendError = function (err) {
        if (err.name === "MulterError") {
            // Multer Error
            if (err.code === "LIMIT_FILE_SIZE") {
                // Payload Too Large
                this.status(HTTP_STATUS_CODES.LARGE_PAYLOAD).json({
                    status: HTTP_STATUS_CODES.LARGE_PAYLOAD,
                    expose: true,
                    message: err.message
                });
            }
        } else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
            // JSON validation field
            this.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                status: HTTP_STATUS_CODES.BAD_REQUEST,
                expose: false,
                message: "JSON validation failed."
            });
        } else if (err.name === "ValidationError") {
            // Manage Mongoose error // Validation failed
            const message = [];
            let title = "Validation Error";
            let code = HTTP_STATUS_CODES.BAD_REQUEST;
            let expose = true;
            const fields = {
                required: [],
                len: [],
                castError: []
            };
            for (const field in err.errors) {
                if (Object.prototype.hasOwnProperty.call(err.errors, field)) {
                    continue;
                }
                switch (err.errors[field].kind) {
                    case "required":
                        fields.required.push(field);
                        break;
                    case "maxlength":
                    case "minlength":
                        fields.len.push(field);
                        break;
                    case "String":
                    case "Number":
                        if (err.errors[field].name === "CastError") {
                            fields.castError.push(field);
                        }
                        break;
                    default:
                        break;
                }
            }
            if (fields.required.length > 0) {
                message.push(`Following fields are required: ${fields.required.join(", ")}`);
            }
            if (fields.len.length > 0) {
                message.push(`Following fields do not match length criteria: ${fields.len.join(", ")}`);
            }
            if (fields.castError.length > 0) {
                message.push(`Following fields do not have valid value: ${fields.castError.join(", ", s)}`);
            }
            if (message.length === 0) {
                console.error(err);
                title = "Error";
                code = 500;
                expose = false;
                message.push("Unknown Error");
            }
            this.status(code).json({
                data: err.data || undefined,
                status: code,
                expose: expose,
                message: message.join(", "),
                title: title
            });
        } else if (err.name === "MongoServerError") {
            if (err.code === 11000) {
                // TODO:Manage duplicate key error.
                let msg = "Duplicate Value.";
                const fields = [];
                try {
                    const field = err.errmsg.split("index:")[1].split("dup key")[0].split("_")[0].trim();
                    let value = "";
                    try {
                        value = err.errmsg.split("index:")[1].split("dup key")[1].split("\"")[1].trim();
                    } catch (err) { }
                    if (value === "") {
                        msg = `Value already exist or duplicate for '${field}' field`;
                    } else {
                        msg = `'${value}' value already exist or duplicate for '${field}' field`;
                    }
                    const fieldValue = {};
                    fieldValue[field] = value;
                    fields.push(fieldValue);
                } catch (err) {
                    msg = "Duplicate Value.";
                }
                this.status(HTTP_STATUS_CODES.CONFLICT).json({
                    data: err.data || undefined,
                    status: HTTP_STATUS_CODES.CONFLICT,
                    expose: true,
                    title: "Value already exists.",
                    message: msg,
                    fields: fields
                });
                console.debug(`Duplicate value: ${err.errmsg}`);
            } else {
                console.error("Mongo error error-code: ", err);
                // Internal Server Error
                this.status(HTTP_STATUS_CODES.SERVER_ERROR).json({
                    data: err.data || undefined,
                    status: HTTP_STATUS_CODES,
                    expose: false,
                    title: "System Error",
                    message: "Unknown database error."
                });
            }
        } else if (err.type === 'StripeCardError') {
            const code = err.statusCode || err.code || HTTP_STATUS_CODES.SERVER_ERROR;
            // Stripe Card Error
            this.status(code).json({
                status: code,
                expose: true,
                message: err.message
            });
        } else {
            const code = err.statusCode || err.code || HTTP_STATUS_CODES.SERVER_ERROR;
            if (code === HTTP_STATUS_CODES.SERVER_ERROR) {
                console.error(err);
            }
            console.log(code);
            const expose = HTTP_STATUS_CODES.SERVER_ERROR !== code;
            this.status(code).json({
                data: err.data || undefined,
                status: code,
                message: 'Internal Server Error'
            });
        }
    };
};