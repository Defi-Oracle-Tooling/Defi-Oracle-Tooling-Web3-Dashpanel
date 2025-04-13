import { Request, Response, NextFunction } from 'express';
import logger from './logger';

interface AppError extends Error {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
}

const handleOperationalError = (err: AppError, res: Response) => {
    logger.warn('Operational error occurred', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        status: err.status
    });
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message,
    });
};

const handleProgrammingError = (err: Error, res: Response) => {
    logger.error('Programming or unknown error occurred', {
        message: err.message,
        stack: err.stack
    });
    // In development, send detailed error. In production, send generic message.
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
            error: err,
            stack: err.stack,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

// Global error handling middleware
// Must have 4 arguments for Express to recognize it as an error handler
const globalErrorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    // Default values
    const error = err as AppError;
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (error.isOperational) {
        handleOperationalError(error, res);
    } else {
        // Programming or other unknown error: don't leak error details in production
        handleProgrammingError(error, res);
    }
};

export default globalErrorHandler;
