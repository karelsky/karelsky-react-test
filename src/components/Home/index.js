import Banner from './Banner';
import Currency from './Currency';
import MainView from './MainView';
import React from 'react';
import UsersPostedRecently from './UsersPostedRecently';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  FOLLOW_USER,
  UNFOLLOW_USER
} from '../../constants/actionTypes';
import './Home.css';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onFollow: username =>
    dispatch({ type: FOLLOW_USER, payload: agent.Profile.follow(username).then(() => agent.Articles.total()) }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnfollow: username =>
    dispatch({ type: UNFOLLOW_USER, payload: agent.Profile.unfollow(username).then(() => agent.Articles.total()) }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});
  
class Home extends React.Component { 

  componentWillMount() {
    const tab = this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;

    let date = new Date();
    let currencyPromises = [];
    date.setDate(date.getDate() + 1); //consumes less time to load
    for (let i = 0; i < 10; i++) {
      date.setDate(date.getDate() - 1);
      let month = date.getMonth() + 1;
      if (month < 10) month = '0' + month;
      let formattedDate = date.getFullYear() + '-' + month + '-' + date.getDate();
      if (this.props.token)
        currencyPromises.push(agent.Currency.get(formattedDate));
    }
    
    const totalArticlesPromise = this.props.token ? agent.Articles.total : () => false;

    this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), articlesPromise(), totalArticlesPromise(), Promise.all([...currencyPromises])]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {

    let sidebarClasses = 'sidebar';
    if (!this.props.token) {
      sidebarClasses += ' no-auth';
    }

    return (
      <div className="home-page">

        <Banner token={this.props.token} appName={this.props.appName} />

        <div className="container page">
          <div className="row">
            <MainView />

            <div className="col-md-3">
              <div className="sidebar">

                <p>Popular Tags</p>

                <Tags
                  tags={this.props.tags}
                  onClickTag={this.props.onClickTag} />

              </div>
            
              <div className={sidebarClasses} style={{marginTop: 1.5 + 'rem'}}>

                <p>Currency Rates (EUR/USD)</p>

                <Currency
                  rates={this.props.rates} />

              </div>
              
              <div className={sidebarClasses} style={{marginTop: 1.5 + 'rem'}}>

                <p>Users who posted yesterday</p>

                <UsersPostedRecently
                  articles={this.props.total}
                  follow={this.props.onFollow}
                  unfollow={this.props.onUnfollow}
                  currentUser={this.props.currentUser ? this.props.currentUser.username : null} />

              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);