//main 함수 index.ejs 뷰를 렌더링하여 응답을 보내는 역할
exports.main = (req, res) => {
  res.render('index');
};
// 로그인 페이지를 보여주는 역할
exports.login = (req, res) => {
  res.render('login');
};
//회원가입하는 페이지를 보여주는 역할
exports.signUp = (req, res) => {
  res.render('signUp');
};
// 고객 정보 조회(사용자 프로필) 페이지를 보여주는 역할
exports.profile = (req, res) => {
  res.render('profile');
};