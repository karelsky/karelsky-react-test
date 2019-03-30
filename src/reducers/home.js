import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED, FOLLOW_USER, UNFOLLOW_USER } from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        tags: action.payload[0].tags,
        total: action.payload[2].articles,
        rates: action.payload[3]
      };
    case HOME_PAGE_UNLOADED:
      return {};
    case FOLLOW_USER:
    case UNFOLLOW_USER:
      return {
        ...state,
        total: action.payload.articles
      };
    default:
      return state;
  }
};
