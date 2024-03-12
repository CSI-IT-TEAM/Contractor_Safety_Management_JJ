// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state cho slice, có thể kèm giá trị mặc định ban đầu
const initialState = {
  user: {
    username: "Guest 1", // State username với giá trị mặc định là "Guest"
    displayname: "Guest 1", // State display name
    avatar: null, // State avatar
    Permission: "GUEST",
    plant_cd: '--',
    dept_cd: "--",
    isAuth: false, // State
    isChief: false,
    // Có thể khai báo nhiều state khác nữa
  },
  userPermiss: []
};

// Cấu hình slice
export const userSlice = createSlice({
  name: "user", // Tên của slice, mỗi slice đặt 1 tên khác nhau để phân biệt
  initialState,
  // Reducers chứa các hàm xử lý cập nhật state
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    updatePermiss: (state, action) => {
        state.userPermiss = action.payload;
    },
  },
});

// Export action ra để sử dụng cho tiện.
export const { updateUser, updatePermiss } = userSlice.actions;
// Action là 1 hàm trả về object dạng {type, payload}, chạy thử console.log(updateUsername()) để xem chi tiết

// Hàm giúp lấy ra state mong muốn.
// Hàm này có 1 tham số là root state là toàn bộ state trong store, chạy thử console.log(state) trong nội dung hàm để xem chi tiết
export const selectUser = (state) => state.user;
// Export reducer để nhúng vào Store
export default userSlice.reducer;
