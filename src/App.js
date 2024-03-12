import { BrowserRouter } from "react-router-dom";
import "./App.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import RouterPage from "./Pages/RoutePage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-image-gallery/styles/scss/image-gallery.scss";
// import "gantt-task-react/dist/index.css";
import "smart-webcomponents/source/styles/smart.default.css"
function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        {/* <div class="snowflakes" aria-hidden="true">
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
          <div class="snowflake">❅</div>
          <div class="snowflake">❆</div>
        </div> */}
        <RouterPage />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
