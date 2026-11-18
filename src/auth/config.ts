/**
 * Mật khẩu vào docs, lưu dưới dạng SHA-256 của `${PASSWORD_SALT}${mật khẩu}` để không lộ chữ thật trong code.
 *
 * Đổi mật khẩu: chạy lệnh dưới (thay <mật-khẩu-mới>), dán kết quả vào PASSWORD_HASH rồi deploy lại.
 * Mọi người đã đăng nhập sẽ phải nhập lại mật khẩu mới.
 *
 *   node -e "console.log(require('crypto').createHash('sha256').update('six-js-docs:' + process.argv[1]).digest('hex'))" <mật-khẩu-mới>
 */
export const PASSWORD_SALT = "six-js-docs:";
export const PASSWORD_HASH = "a5df48ae640c064156eada935eaf8dd7fedcfbd26814dd43cc38944242c96f04";

/** Sau bao lâu thì phải nhập lại mật khẩu. */
export const LOGIN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
