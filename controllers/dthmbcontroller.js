const axios = require('axios');
const User = require('../models/quser'); // 쿼리 모델

exports.getTempData = async (req,res) => {
    try {
        const userId = req.params.id;
        const uniqueUser = await User.getUniqueUser(userId);
        console.log( 'id : ' ,userId);
        const response = await axios.get(`http://louk342.iptime.org:3010/data?uuid=${userId}`);
        //const response = await axios.get(`http://louk342.iptime.org:3010/data`);
        const data = response.data;
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
      }
};

exports.testcontroller = async(req,res) => {
  const user_login_id = req.params.user_login_id;
  console.log (user_login_id);
  
  const user_id = await User.getUniqueUser(user_login_id);
  console.log(user_id);


  const token = await User.SelDev(user_id);
  if (!token) {
    throw new Error('유효한 FCM 토큰이 없습니다.');
  }

  res.status(200).json({ message: '성공' });


}