import CryptoJS from 'crypto-js'
export default {
	install(Vue) {
		Vue.prototype.$DesEncrypt = function desEncrypt(data, key) { //加密
			if (typeof data != "string") {
				console.log("加密前不是字符串");
				return false
			}
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var encrypted = CryptoJS.DES.encrypt(data, keyHex, {
			mode: CryptoJS.mode.ECB, //加密的模式。ECB
			padding: CryptoJS.pad.Pkcs7
		});
			return encrypted.toString(); //返回的是密文
		}
	}
}