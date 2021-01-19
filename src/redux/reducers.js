import * as actionsTypes from './actions';

export const authenticationReducer = (state = { isAuthenticated: false, authenticatedUserID: null, authenticatedUsername: null }, action) => {
  switch (action.type) {
    case actionsTypes.SET_AUTHENTICATION:
      return { ...state, isAuthenticated: action.payload };
    case actionsTypes.SET_AUTHENTICATED_USER_ID:
      return { ...state, authenticatedUserID: action.payload };
    case actionsTypes.SET_AUTHENTICATED_USERNAME:
      return { ...state, authenticatedUsername: action.payload };
    default:
      return state;
  }
};

export const messengerReducer = (state = {
  isSidebarOpen: true, currentChatRoomID: null, currentChatRoom: null, usersChatRoomsID: [], currentChatRoomName: 'Unanimity', notification: null,
}, action) => {
  switch (action.type) {
    case actionsTypes.SET_ISSIDEBAROPEN:
      return { ...state, isSidebarOpen: action.payload };
    case actionsTypes.SET_CURRENTCHATROOMID:
      return { ...state, currentChatRoomID: action.payload };
    case actionsTypes.SET_CURRENTCHATROOM:
      return { ...state, currentChatRoom: action.payload };
    case actionsTypes.SET_CURRENTCHATROOMNAME:
      return { ...state, currentChatRoomName: action.payload };
    case actionsTypes.SET_USERSCHATROOMSID:
      return { ...state, usersChatRoomsID: action.payload };
    case actionsTypes.SET_NOTIFICATION:
      return { ...state, notification: action.payload };
    default:
      return state;
  }
};
