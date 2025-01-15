import db from "./db.mjs";
import crypto from "crypto";


export default function achievementDao (){
    console.log(db);
    this.getUserAchi = (id) =>{
        return new Promise((resolve,reject) => {
            const sql = `SELECT 
                            a.id AS achievement_id,
                            a.name AS name,
                            a.description,
                            a.condition,
                            a.icon,
                            a.difficulty,
                            ua.times_gained,
                            a.repeatable
                        FROM 
                            user_achievements ua
                        JOIN 
                            achievements a
                        ON 
                            ua.achievement_id = a.id
                        WHERE 
                            ua.user_id = ?
                        ORDER BY 
                            a.id;
                        `;

            db.all(sql,[id],(err,rows) => {
                if (err) {
                    reject(err);
                }
                else {
                        resolve(rows);
                    };
                })

            })
        }

        this.getAllAchi = () =>{
            return new Promise((resolve,reject) => {
                const sql = "SELECT * FROM achievements"
                db.all(sql,(err,rows) => {
                    if (err) {
                        
                        reject(err);
                        
                    }
                    else {
                        console.log(rows);
                            resolve(rows);
                        };
                    })
    
                })
            }

            this.updateAchi = (user_id, achi_id, value) => {
                return new Promise((resolve, reject) => {
                    const sql = `UPDATE user_achievements SET times_gained = ? WHERE user_id = ? AND achievement_id = ?`;
                    db.run(sql, [value,user_id,achi_id], (err) => {
                        if (err) reject(err);
                        else resolve(this.changes);
                    });
                });
            };
        
            this.updateMatchInfo = (matchInfo,user_id) => {
                return new Promise((resolve, reject) => {
                    const sql = `
                        UPDATE user_match_info 
                        SET 
                            win_streak = ?, loss_streak = ?, perfect_streak = ?, 
                            last_match_result = ?, n_match = ?,n_win = ? 
                        WHERE user_id = ? AND difficulty = ?`;
            
                    const values = [
                        matchInfo.win_streak, matchInfo.loss_streak, matchInfo.perfect_streak,
                        matchInfo.last_match_result,matchInfo.n_match,matchInfo.n_win,
                        user_id,matchInfo.difficulty
                    ];
            
                    db.run(sql, values, function (err) {
                        if (err) reject(err);
                        else resolve(this.changes);
                    });
                });
            };


            this.nWins = (user_id) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT SUM(n_win) AS total_wins
                                FROM user_match_info
                                WHERE user_id = ?
                                `;
                    db.get(sql, [user_id], (err,row) => {
                        if (err) reject(err);
                        else resolve(row.total_wins);
                    });
                });
            };
            
            this.nMatch = (user_id) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT SUM(n_match) AS total_matches_played
                                    FROM user_match_info
                                    WHERE user_id = ?`;
                    db.get(sql, [user_id], (err,row) => {
                        if (err) reject(err);
                        else resolve(row.total_matches_played);
                    });
                });
            };

            this.winEvery = (user_id) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT 
                                SUM(CASE WHEN difficulty = 1 AND n_win > 0 THEN 1 ELSE 0 END) AS won_difficulty_1,
                                SUM(CASE WHEN difficulty = 2 AND n_win > 0 THEN 1 ELSE 0 END) AS won_difficulty_2,
                                SUM(CASE WHEN difficulty = 3 AND n_win > 0 THEN 1 ELSE 0 END) AS won_difficulty_3,
                                SUM(CASE WHEN difficulty = 4 AND n_win > 0 THEN 1 ELSE 0 END) AS won_difficulty_4
                            FROM user_match_info
                            WHERE user_id = ?;
                            `;
                    db.get(sql, [user_id], (err,row) => {
                        if (err) reject(err);
                        else resolve(Object.values(row));
                    });
                });
            };

            this.kWins = (user_id, k) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT n_win
                                FROM user_match_info
                                WHERE user_id = ? AND difficulty = ?`;
                    db.get(sql, [user_id,k], (err,row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });
            };
            
            this.updateStreak = (user_id, difficulty,streak_type) => {
                return new Promise((resolve, reject) => {
                    const sql = `
                        UPDATE user_match_info 
                        SET ${streak_type} = 0 
                        WHERE user_id = ? AND difficulty = ?`;
            
                    const values = [
                        user_id,difficulty
                    ];
            
                    db.run(sql, values, function (err) {
                        if (err) reject(err);
                        else resolve(this.changes);
                    });
                });
            };

            this.matches_info = (user_id, k) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT *
                                FROM user_match_info
                                WHERE user_id = ? AND difficulty = ?`;
                    db.get(sql, [user_id,k], (err,row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });
            };

            this.achievemntFromId = (achi_id) => {
                return new Promise((resolve, reject) => {
                    const sql = `SELECT *
                                FROM achievements
                                WHERE id = ? `;
                    db.get(sql, [achi_id], (err,row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                });
            };

}