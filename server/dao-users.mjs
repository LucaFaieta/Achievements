/* Data Access Object (DAO) module for accessing users data */

import { resolve } from "path";
import db from "./db.mjs";
import crypto from "crypto";


// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() {

    // This function retrieves one user by id
    this.getUserById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM user WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'User not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getUserByCredentials = (email, password) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM user WHERE email=?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = {"id":row.UserId,"email":row.Email};
                    // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                    crypto.scrypt(password, Buffer.from(row.Salt, 'hex'), 64, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.Password, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }


    
}
