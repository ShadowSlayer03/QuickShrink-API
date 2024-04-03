// Since res.next(err) is being passed from notFound function, it will signal express to check for an error handling middleware.
// Since all 4 parameters are taken by this fn, express understands that it is an errorHandler and proper error response is given to client.
function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.message,
        error: {
            status: res.statusCode,
            stack: process.env.ENV === "development" ? err.stack : {}
        }
    });
}

export default errorHandler;