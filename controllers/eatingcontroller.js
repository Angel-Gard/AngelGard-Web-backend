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



// 섭취량 입력(수유량)
exports.Babyeating = async (req,res) => {
        //console.log(today);
    //console.log(req.body);
    const {amount,baby_name} = req.body;
    //console.log(feed_amount,baby_name);

    const bName = await BabyM.Selectbabyid(baby_name);
    //console.log("baby_id : ",bName);

    if(!bName < 0){
        res.status(400).json({result:false,message:'아이 이름 오류'});
    }else{
        const babyeat = {...req.body,today:today,baby_id:bName};
        //console.log(babyeat);

        if(!amount){
            return res.status(400).json({result:false,message:'값을다 입력해 주세요.'});
        }
        else{
            const beating = await EatM.Meating(babyeat);
            //console.log(beating);
            if(beating.length < 1){
                return res.status(403).json({ result: false ,message:'실패'});
            }else{
                return res.status(200).json({ result: true,message:'성공' });
            }
        }
    }
    

};

// 유축량 입력
exports.Pumping = async (req,res) => {

        //console.log(today);
    const {intake,baby_name} = req.body;
    console.log(intake,baby_name);

    if (!intake || !baby_name) {
        return res.status(400).json({ result: false, message: '값을 모두 입력해 주세요.' });
    }
    const baby_id = await BabyM.Selectbabyid(baby_name);

    if(!baby_id){
        return res.status(404).json({result:false,message:'아이 이름을 찾을 수 없습니다.'});
    }else{
        const g_intake = {intake,today,baby_id};
        console.log(g_intake);

        if(!intake){
            return res.status(406).json({result:false,message:'값을다 입력해 주세요.'});
            
        }
        else{
            const bintake = await EatM.Mpumping(g_intake);
            //console.log(bintake);
            if (!bintake || bintake.affectedRows === 0) {
                return res.status(500).json({ result: false, message: '유축량 입력 실패' });
            }
            return res.status(200).json({ result: true, message: '유축량 입력 성공' });
        }
    }

    
};

//모유수유 시간 입력
exports.InsertMS = async (req,res) => {


        const { time,baby_name } = req.body;

        const baby_id = await BabyM.Selectbabyid(baby_name);

        if(!baby_id){
            return res.status(400).json({result:false,message:'아이 이름을 찾을 수 없습니다.'});
        }else{

            const ms_time =  {...req.body,today:today,baby_id:baby_id};
            //console.log(ms_time);

            if(!time){
                return res.status(400).json({result:false,message:'값을다 입력해 주세요.'});
            }else{
                const insetime = await EatM.MMs(ms_time);
                //console.log(insetime);
                if(insetime.length <1){
                    return res.status(403).json({ result: false ,message:'실패'});
                }else{
                    return res.status(200).json({ result: true,message:'성공' });
                }
            }
        }

}

//섭취량 조회
exports.SelectEat = async (req,res) => {

        //console.log(req.body);
        //const {baby_name} = req.body;
        const baby_name = req.params.baby_name;

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

            let total_group_eat = group_eat.reduce((accumulator, current) => {
                return accumulator + current.amount;
            }, 0);

            let total_ygroup_eat = y_group_eat.reduce((accumulator, current) => {
                return accumulator + current.amount;
            }, 0);

            if (Array.isArray(group_eat) && group_eat.length === 0) {
                console.log("오늘 빈 배열입니다.");
                total_group_eat =0;
                return res.status(200).json({today_amount:total_group_eat,yesterday_amount:total_ygroup_eat});
            }

            if (Array.isArray(y_group_eat) && y_group_eat.length === 0) {
                console.log("어제 빈 배열입니다.");
                total_ygroup_eat = 0;
                return res.status(200).json({today_amount:total_group_eat,yesterday_amount:total_ygroup_eat});
            }

            return res.status(200).json({today_amount:total_group_eat,yesterday_amount:total_ygroup_eat});

        }


}

//유축량 조회 
exports.Selectpum = async (req,res) => {

        //console.log(req.body);
        //const {baby_name} = req.body;
        const baby_name = req.params.baby_name;

        const baby_id = await BabyM.Selectbabyid(baby_name);
        
        const today_sel_pum = {date:dateString,baby_id:baby_id};
        const y_sel_pum = {date:ydateString,baby_id:baby_id};

        if(!baby_id){
            console.log("유축량 조회 아기 아이디 못찾음");
            return res.status(406).json({result:false,message:"아이 이름을 찾을 수 없습니다."})
        }else{
            const group_pum = await EatM.Mpum(today_sel_pum);
            const y_group_pum = await EatM.Mpum(y_sel_pum);
            console.log("오늘 펌: ",group_pum);
            console.log("어제 펌: ",y_group_pum);

            let total_group_pum = group_pum.reduce((accumulator, current) => {
                return accumulator + current.intake;
            }, 0);

            let total_ygroup_pum = y_group_pum.reduce((accumulator, current) => {
                return accumulator + current.intake;
            }, 0);

            console.log("토탈 : ",total_group_pum);
            console.log("토탈 : ",total_ygroup_pum);

            if (Array.isArray(group_pum) && group_pum.length === 0) {
                console.log("오늘 빈 배열입니다.");
                total_group_pum =0;
                return res.status(200).json({today_intake:total_group_pum,yesterday_intake:total_ygroup_pum});
            }

            if (Array.isArray(y_group_pum) && group_pum.length === 0) {
                console.log("어제 빈 배열입니다.");
                total_ygroup_pum = 0;
                return res.status(200).json({today_intake:total_group_pum,yesterday_intake:total_ygroup_pum});
            }

            return res.status(200).json({today_intake:total_group_pum,yesterday_intake:total_ygroup_pum});
            
        }

}


//모유수유 시간 조회
exports.SelectMS = async (req,res) => {

        //const {baby_name} = req.body;
        const baby_name = req.params.baby_name;

        const baby_id = await BabyM.Selectbabyid(baby_name);
        console.log("오늘 : ",dateString);
        console.log("어제 : ",ydateString);

        const today_sel_time = {date:dateString,baby_id:baby_id};
        const y_sel_time = {date:ydateString,baby_id:baby_id};

        if(!baby_id){
            res.status(400).json({result:false,message:"아이 이름을 찾을 수 없습니다."})
        }else{
            const group_time = await EatM.MselectMS(today_sel_time);
            const y_group_time = await EatM.MselectMS(y_sel_time);
            console.log("오늘 : ",group_time);
            console.log("어제 : ",y_group_time);

            let total_group_time = group_time.reduce((accumulator, current) => {
                return accumulator + current.time;
            }, 0);

            let total_ygroup_time = y_group_time.reduce((accumulator, current) => {
                return accumulator + current.time;
            }, 0);

            if (Array.isArray(group_time) && group_time.length === 0) {
                console.log("오늘 빈 배열입니다.");
                total_group_time =0;
                return res.status(200).json({today_time:total_group_time,yesterday_time:total_ygroup_time});
            }

            if (Array.isArray(y_group_time) && y_group_time.length === 0) {
                console.log("어제 빈 배열입니다.");
                total_ygroup_time = 0;
                return res.status(200).json({today_time:total_group_time,yesterday_time:total_ygroup_time});
            }

            return res.status(200).json({today_time:total_group_time,yesterday_time:total_ygroup_time});
        }



}