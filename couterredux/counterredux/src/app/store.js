import { configureStore } from "@reduxjs/toolkit";
import counterReducer from '../components/Counterslice';
export default configureStore({
    reducer: {
        counter: counterReducer,
    }
});