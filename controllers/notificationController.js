const admin = require('firebase-admin');
const fcm = require('../fcm');
const User = require('../models/quser');

const sendNotification = async (req, res) => {
  try {

    fcm.connect();
    const user_id = req.params.uuid;
    //const {user_id} = req.body;


    const token = await User.SelDev(user_id);
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
    res
      .status(err.status || 500)
      .json({ message: err.message || '문제가 발생했습니다!' });
  }
};

module.exports = { sendNotification };
