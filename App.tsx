import { Switch, Route } from "wouter";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Wallet from "./Wallet";
import Products from "./Products";
import Admin from "./Admin";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/products" component={Products} />
        <Route path="/admin" component={Admin} />
        <Route>404 Not Found</Route>
      </Switch>
      <Toaster position="top-right" theme="dark" />
    </>
  );
}

export default App;