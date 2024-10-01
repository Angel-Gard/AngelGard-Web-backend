const EatM = require('../models/eatingmodel'); // 쿼리 모델
const BabyM = require('../models/quser');


//const userre = await User.MgetUserDetails(bodyid);


//금일 날짜
const today = new Date();
const ydate = new Date();
const year = today.getFullYear();
const month = ('0' + (today.getMonth() + 1)).slice(-2);
const day = ('0' + today.getDate()).slice(-2);

const dateString = year + '-' + month  + '-' + day;

//전날 날짜
const sel_day = -1;
ydate.setDate(ydate.getDate() + sel_day);

const yyear = ydate.getFullYear();
const ymonth = ('0' + (ydate.getMonth() + 1)).slice(-2);
const yday = ('0' + ydate.getDate()).slice(-2);

const ydateString = yyear + '-' + ymonth  + '-' + yday;



// 섭취량 입력
exports.Babyeating = async (req,res) => {
    //console.log(today);
    //console.log(req.body);
    const {feed_amount,baby_name} = req.body;
    //console.log(feed_amount,baby_name);

    const bName = await BabyM.Selectbabyid(baby_name);
    //console.log("baby_id : ",bName);

    if(!bName < 0){
        res.status(400).json({result:false,message:'아이 이름 오류'});
    }else{
        const babyeat = {...req.body,today:today,baby_id:bName};
        //console.log(babyeat);

        if(!feed_amount){
            res.status(400).json({result:false,message:'값을다 입력해 주세요.'});
        }
        else{
            const beating = await EatM.Meating(babyeat);
            //console.log(beating);
            if(beating.length < 1){
                res.status(403).json({ result: false ,message:'실패'});
            }else{
                res.status(200).json({ result: true,message:'성공' });
            }
        }
    }

};

// 유축량 입력
exports.Pumping = async (req,res) => {
    //console.log(today);
    const {intake_amount,baby_name} = req.body;
    //console.log(intake_amount,baby_name);

    const baby_id = await BabyM.Selectbabyid(baby_name);
    

    if(!baby_id){
        res.status(400).json({result:false,message:'아이 이름을 찾을 수 없습니다.'});
    }else{
        const intake = {...req.body,today:today,baby_id:baby_id};
        //console.log(intake);

        if(!intake_amount){
            res.status(400).json({result:false,message:'값을다 입력해 주세요.'});
        }
        else{
            const bintake = await EatM.Mpumping(intake);
            //console.log(bintake);
            if(bintake.length < 1){
                res.status(403).json({ result: false ,message:'실패'});
            }else{
                res.status(200).json({ result: true,message:'성공' });
            }
        }
    }


};

//모유수유 시간 입력
exports.InsertMS = async (req,res) => {

    const { m_time,baby_name } = req.body;

    const baby_id = await BabyM.Selectbabyid(baby_name);

    if(!baby_id){
        res.status(400).json({result:false,message:'아이 이름을 찾을 수 없습니다.'});
    }else{

        const ms_time =  {...req.body,today:today,baby_id:baby_id};
        //console.log(ms_time);

        if(!m_time){
            res.status(400).json({result:false,message:'값을다 입력해 주세요.'});
        }else{
            const insetime = await EatM.MMs(ms_time);
            //console.log(insetime);
            if(insetime.length <1){
                res.status(403).json({ result: false ,message:'실패'});
            }else{
                res.status(200).json({ result: true,message:'성공' });
            }
        }
    }


}

//섭취량 조회
exports.SelectEat = async (req,res) => {
    //console.log(req.body);
    const {baby_name} = req.body;

    const baby_id = await BabyM.Selectbabyid(baby_name);

    const today_sel_eat = {date:dateString,baby_id:baby_id};
    const y_sel_eat = {date:ydateString,baby_id:baby_id};
    

    if(!baby_id){
        res.status(400).json({result:false,message:"아이 이름을 찾을 수 없습니다."})
    }else{
        const group_eat = await EatM.MselectEating(today_sel_eat);
        const y_group_eat = await EatM.MselectEating(y_sel_eat);
        //console.log(group_eat);
        //console.log(y_group_eat);

        const total_group_eat = group_eat.reduce((accumulator, current) => {
            return accumulator + current.feed_amount;
        }, 0);

        let total_ygroup_eat = y_group_eat.reduce((accumulator, current) => {
            return accumulator + current.feed_amount;
        }, 0);

        if(!group_eat ||y_group_eat ){//실패
            if(!group_eat){
                res.status(401).json({result:false,message:"오늘 기록이 없습니다."})
            }else{
                total_ygroup_eat = 0;
                res.status(200).json({"오늘 수유량":total_group_eat,"전날 수유량":total_ygroup_eat});
            }
        }else{
            res.status(200).json({"오늘 수유량":total_group_eat,"전날 수유량":total_ygroup_eat});
        }
    }

    

}

//유축량 조회 
exports.Selectpum = async (req,res) => {
    //console.log(req.body);
    const {baby_name} = req.body;

    const baby_id = await BabyM.Selectbabyid(baby_name);
    
    const today_sel_pum = {date:dateString,baby_id:baby_id};
    const y_sel_pum = {date:ydateString,baby_id:baby_id};

    if(!baby_id){
        res.status(400).json({result:false,message:"아이 이름을 찾을 수 없습니다."})
    }else{
        const group_pum = await EatM.Mpum(today_sel_pum);
        const y_group_pum = await EatM.Mpum(y_sel_pum);
        console.log("오늘 펌: ",group_pum);
        console.log("어제 펌: ",y_group_pum);

        const total_group_pum = group_pum.reduce((accumulator, current) => {
            return accumulator + current.intake_amount;
        }, 0);

        let total_ygroup_pum = y_group_pum.reduce((accumulator, current) => {
            return accumulator + current.intake_amount;
        }, 0);

        console.log("토탈 : ",total_group_pum);
        console.log("토탈 : ",total_ygroup_pum);
        
        if(!group_pum || y_group_pum){//실패
            if(!group_pum){
                return res.status(401).json({result:false,message:"오늘 기록이 없습니다."})
            }else{
                total_ygroup_pum = 0;
                return res.status(200).json({"오늘 유축량":total_group_pum,"전날 유축량":total_ygroup_pum});
            }

        }else{
            return res.status(200).json({"오늘 유축량":total_group_pum,"전날 유축량":total_ygroup_pum});
        }
    }
}


//모유수유 시간 조회
exports.SelectMS = async (req,res) => {
    const {baby_name} = req.body;

    const baby_id = await BabyM.Selectbabyid(baby_name);

    const today_sel_time = {date:dateString,baby_id:baby_id};
    const y_sel_time = {date:ydateString,baby_id:baby_id};

    if(!baby_id){
        res.status(400).json({result:false,message:"아이 이름을 찾을 수 없습니다."})
    }else{
        const group_time = await EatM.MselectMS(today_sel_time);
        const y_group_time = await EatM.MselectMS(y_sel_time);
        //console.log(group_time);
        //console.log(y_group_time);

        const total_group_time = group_time.reduce((accumulator, current) => {
            return accumulator + current.m_time;
        }, 0);

        let total_ygroup_time = y_group_time.reduce((accumulator, current) => {
            return accumulator + current.m_time;
        }, 0);
        if(!group_time || !y_group_time){//실패
            if(!group_time){
                res.status(401).json({result:false,message:"오늘 기록이 없습니다."})
            }else{
                total_ygroup_time = 0;
                res.status(200).json({"오늘 총시간":total_group_time,"전날 총시간":total_ygroup_time});
            }
        }else{
            res.status(200).json({"오늘 총시간":total_group_time,"전날 총시간":total_ygroup_time});
        }
    }

}