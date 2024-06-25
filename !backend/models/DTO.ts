import express, { Request, Response, NextFunction } from 'express';

export interface Login {
    username: string;
    password: string;
    description: string | undefined;
    twitterhandle: string | undefined;
    linkedinhandle: string | undefined;
    githubhandle: string | undefined;
};

export interface Register {
    username: string;
    password: string;
    email: string;
    description: string | "No description provided";
    twitterhandle: string | "No twitter handle provided";
    linkedinhandle: string | "No linkedin handle provided";
    githubhandle: string | "No github handle provided";
};



export function validateRegister(req: Request, res: Response, next: NextFunction){
 
    const registerData: Register = req.body;
    const requiredFields = ['username', 'password', 'email'];

    for (const field of requiredFields) {
        if (!(field in registerData)) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }
    next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction){

    const loginData: Login = req.body;
    const requiredFields = ['username', 'password'];

    for (const field of requiredFields) {
        if (!(field in loginData)) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }
    next();
}
