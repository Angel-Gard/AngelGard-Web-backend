const admin = require('firebase-admin');
const fcm = require('../fcm');
const User = require('../models/quser');


const sendNotification = async (req, res) => {
  try {
    let user_id_ = req.params.uuid;
    console.log("넘어온 uuid : ",user_id_);
    //const {user_id} = req.body;
    //const user_login_id = req.params.user_login_id;
    //console.log (user_login_id);
    //const user_id_ = await User.getUniqueUser(user_login_id);
    const uN = user_id_[0];
    console.log('숫자' , uN);
    if(uN== 0){
      user_id_=13;
    }
    if(uN ==1){
      user_id_=13;
    }

    console.log('유저아이디:',user_id_);

    const tokenData = await User.SelDev(user_id_);

    //console.log(tokenData);

    const token = tokenData[0]?.user_fcmtoken;

    console.log('토큰값 : ',token);

    if (!token) {
      return res.status(400).json({ message: '유효한 FCM 토큰이 없습니다.' });
    }

    const title = 'ANGEL GUARD';
    const body = '아이의 상태를 확인해 주세요!';

    // FCM을 통해 알림 전송
    await admin.messaging().send({
      token: token,
      android: {
        data: {
          title,
          body,
        },
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,
            sound: 'default',
            alert: {
              title,
              body,
            },
          },
        },
      },
    });

    res.status(200).json({ message: '알림이 성공적으로 전송되었습니다!' });
  } catch (err) {
    console.error('알림 전송 중 오류 발생:', err);
    res.status(500).json({ message: '알림 전송 중 오류가 발생했습니다.' });
  }
};

module.exports = { sendNotification };
