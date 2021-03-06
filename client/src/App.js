import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import'./App.css';
import Home from "./components/Home/Home";
import Products from "./components/Products/Products";
import NotFound from "./components/NotFound";
import NavBar from "./components/Header/NavBar";
import adminRoute from "./components/Admin/adminLogin"
import Product from './components/Product/Product';
import CreateProduct from './components/CreateProduct/createProduct';
import Alert from './components/Alert';
import About from './components/About/About';

//Redux
import { Provider, connect } from 'react-redux';
import store from './store';
import { loadUser, loadAdmin} from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/Routing/PrivateRoute';

//stripe
import Checkout from './components/Checkout/Checkout';
import Cart from './components/Cart/Cart';

const App = () => {
  useEffect(() => {
    setAuthToken(localStorage.token);
    store.dispatch(loadAdmin());
  }, []);

  return (
      <Provider store={store}>
        <div>
          <NavBar />
          <Alert />
          <Switch>
            <Route exact path="/Home" component={Home} />
            <Route exact path="/About" component={About} />
            <Route exact path="/Products" component={Products} />
            <Route exact path='/Product/:id' component={Product} />
            <PrivateRoute exact path="/createproduct" component={CreateProduct} />
            <Route exact path="/Cart" component={Cart} />
            <Route exact path="/admin/login" component={adminRoute} />
            <Route exact path="/">
              <Redirect to="/Home" />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </div>
      </Provider>

  );
}
export default App;
