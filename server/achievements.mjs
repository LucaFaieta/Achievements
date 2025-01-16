export default function Achievements(){


    this.add_match = (history,match) =>{
        const new_score = {...history}
        new_score.n_match += 1;
        if (match.won){
            new_score.last_match_result = "won";
            new_score.win_streak += 1;
            new_score.loss_streak = 0;
            new_score.n_win += 1;
            if(match.nGuess === 1) new_score.perfect_streak +=1;
            else new_score.perfect_streak = 0;

        }else{
            new_score.last_match_result = "lost";
            new_score.win_streak = 0;
            new_score.loss_streak += 1;
            new_score.perfect_streak = 0;

        }
        return new_score;
    }

    this.check_achi = async (stats,db,user_achi,user_id) =>{
        const difficulty = stats.difficulty-1;
        const welcomed = 0;
        const brain_on = 1;
        const banana_skin = 2;
        const starter = 3 + difficulty;
        const endurance = 7 + difficulty;
        const lucky = 11 + difficulty;
        const all_rounder = 15;
        const persistent = 16 + difficulty;
        const marathoner = 20;
        const perfect = 21 + difficulty;

        const achi = user_achi;
        let new_achi = [...user_achi]; 
        let list_achi = [];
        if (achi[welcomed].times_gained === 0){
            const n_match = await db.nMatch(user_id);
            
            if (n_match === 1){
                new_achi[welcomed].times_gained = 1;
                list_achi.push(achi[welcomed].achievement_id);
                db.updateAchi(user_id,achi[welcomed].achievement_id,new_achi[welcomed].times_gained);
                }
                
            }
            if(achi[brain_on].times_gained === 0){
                const n_win = await db.nWins(user_id);
                if (n_win === 1){
                    new_achi[brain_on].times_gained = 1;
                    list_achi.push(achi[brain_on].achievement_id);
                    db.updateAchi(user_id,achi[brain_on].achievement_id,new_achi[brain_on].times_gained);
                }
            }
            if (achi[banana_skin].times_gained === 0){
                const n_match = await db.nMatch(user_id);
                const n_win = await db.nWins(user_id);
                if (n_match - n_win >= 1){
                    new_achi[banana_skin].times_gained = 1;
                    list_achi.push(achi[banana_skin].achievement_id);
                    db.updateAchi(user_id,achi[banana_skin].achievement_id,new_achi[banana_skin].times_gained);
                }
            }
            if (new_achi[marathoner].times_gained === 0){
                const n_match = await db.nMatch(user_id);
                if (n_match === 50){
                    new_achi[marathoner].times_gained = 1;
                    list_achi.push(achi[marathoner].achievement_id);
                    db.updateAchi(user_id,achi[marathoner].achievement_id,new_achi[marathoner].times_gained);
            }
            }

            if(achi[all_rounder].times_gained === 0){
                const res = await db.winEvery(user_id);
                if(res.every(value => value ===1)){
                    new_achi[all_rounder].times_gained = 1;
                    list_achi.push(achi[all_rounder].achievement_id);
                    db.updateAchi(user_id,achi[all_rounder].achievement_id,new_achi[all_rounder].times_gained);
                }
            }
            const k_wins = stats.n_win;
            if(achi[starter].times_gained === 0){
                if (k_wins === 1){
                    new_achi[starter].times_gained = 1;
                    list_achi.push(achi[starter].achievement_id);
                    db.updateAchi(user_id,achi[starter].achievement_id,new_achi[starter].times_gained);
                }
            }

            const multi = k_wins % 10 === 0;
            if(multi && (Math.floor(k_wins / 10))> achi[endurance].times_gained){
                new_achi[endurance].times_gained += 1;
                list_achi.push(achi[endurance].achievement_id);
                db.updateAchi(user_id,achi[endurance].achievement_id,new_achi[endurance].times_gained);
            }

            if(stats.win_streak === 5){
                new_achi[lucky].times_gained += 1;
                list_achi.push(achi[lucky].achievement_id);
                db.updateStreak(user_id,stats.difficulty,"win_streak");
                db.updateAchi(user_id,achi[lucky].achievement_id,new_achi[lucky].times_gained);
            }

            if(stats.loss_streak === 5){
                new_achi[persistent].times_gained += 1;
                list_achi.push(achi[persistent].achievement_id);
                db.updateStreak(user_id,stats.difficulty,"loss_streak");
                db.updateAchi(user_id,achi[persistent].achievement_id,new_achi[persistent].times_gained);
            }

            if(stats.perfect_streak === 3){
                new_achi[perfect].times_gained += 1;
                list_achi.push(achi[perfect].achievement_id);
                db.updateStreak(user_id,stats.difficulty,"perfect_streak");
                db.updateAchi(user_id,achi[perfect].achievement_id,new_achi[perfect].times_gained);
            }


        return {"list_achi":new_achi,"new_achi":list_achi};

    } 


    
}