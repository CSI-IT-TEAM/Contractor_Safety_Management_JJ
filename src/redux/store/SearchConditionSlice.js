// store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Khởi tạo state cho slice, có thể kèm giá trị mặc định ban đầu
const initialState = {
  search: {
    status_code: "ALL",
    req_date: [new Date(), new Date()],
    keywords: "",
  },
};

// Cấu hình slice
export const searchSlice = createSlice({
  name: "search", // Tên của slice, mỗi slice đặt 1 tên khác nhau để phân biệt
  initialState,
  // Reducers chứa các hàm xử lý cập nhật state
  reducers: {
    updateSearchCondition: (state, action) => {
      state.search = action.payload;
    },
  },
});

// Export action ra để sử dụng cho tiện.
export const { updateSearchCondition } = searchSlice.actions;
// Action là 1 hàm trả về object dạng {type, payload}, chạy thử console.log(updateUsername()) để xem chi tiết

// Hàm giúp lấy ra state mong muốn.
// Hàm này có 1 tham số là root state là toàn bộ state trong store, chạy thử console.log(state) trong nội dung hàm để xem chi tiết
export const selectSearchCondition = (state) => state.search;
// Export reducer để nhúng vào Store
export default searchSlice.reducer;
