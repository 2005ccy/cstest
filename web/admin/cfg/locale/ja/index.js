
import header from './components/header/header.js';
import registeEmail from './components/register/email.js';
import registeCaptcha from './components/register/captcha.js';
import registe from './page/register.js';
import registeMobile from './components/register/mobile.js';

let vals = Object.assign({}, header, registeEmail, registeCaptcha, registe, registeMobile);

window.csI18nja = vals;
export default csI18nja;