class ApiError extends Error {
	constructor(status, message) {
		super(message);
		this.status = status;
		this.message = message;
	}

	static badRequest(message = "Bad Request") {
		return new ApiError(400, message);
	}

	static unauthorized(message = "Unauthorized") {
		return new ApiError(401, message);
	}

	static forbidden(message = "Forbidden") {
		return new ApiError(403, message);
	}

	static notFound(message = "Not Found") {
		return new ApiError(404, message);
	}

	static conflict(message = "Conflict") {
		return new ApiError(409, message);
	}

	static unprocessableEntity(message = "Unprocessable Entity") {
		return new ApiError(422, message);
	}

	static tooManyRequests(message = "Too Many Requests") {
		return new ApiError(429, message);
	}

	static internal(message = "Internal Server Error") {
		return new ApiError(500, message);
	}

	static serviceUnavailable(message = "Service Unavailable") {
		return new ApiError(503, message);
	}
}

module.exports = ApiError;