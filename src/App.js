import { HashRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./view/home";
import Login from "./view/login";
import Register from "./view/register";
import Forgot from "./view/forgot";
import "./css/index.css"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="/forgot" exact component={Forgot} />
      </Switch>
    </Router>
  );
}

export default App;
