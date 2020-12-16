export const SET_LANDING = 'SET_LANDING';
export const SET_CONTACTFORM = 'SET_CONTACTFORM';
export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
export const SET_USER_ID = 'SET_USER_ID';
export const SET_USERNAME = 'SET_USERNAME';
export const SET_ISSIDEBAROPEN = 'SET_ISSIDEBAROPEN';
export const SET_CURRENTCHATROOMID = 'SET_CURRENTCHATROOMID';
export const SET_CURRENTCHATROOM = 'SET_CURRENTCHATROOM';
export const SET_CURRENTCHATROOMNAME = 'SET_CURRENTCHATROOMNAME';
export const SET_USERSCHATROOMSID = 'SET_USERSCHATROOMSID';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';

export const setLanding = landingStatus => ({
    type: SET_LANDING,
    payload: landingStatus
});

export const setContactForm = contactStatus => ({
    type: SET_CONTACTFORM,
    payload: contactStatus
});

export const setAuthentication = authStatus => ({
    type: SET_AUTHENTICATION,
    payload: authStatus
});

export const setUserId = userId => ({
    type: SET_USER_ID,
    payload: userId
});

export const setUsername = username => ({
    type: SET_USERNAME,
    payload: username
});

export const setIsSidebarOpen = isSidebarOpen => ({
    type: SET_ISSIDEBAROPEN,
    payload: isSidebarOpen
});

export const setCurrentChatRoomID = currentChatRoomID => ({
    type: SET_CURRENTCHATROOMID,
    payload: currentChatRoomID
});

export const setCurrentChatRoom = currentChatRoom => ({
    type: SET_CURRENTCHATROOM,
    payload: currentChatRoom
});

export const setCurrentChatRoomName = currentChatRoomName => ({
    type: SET_CURRENTCHATROOMNAME,
    payload: currentChatRoomName
});

export const setUsersChatRoomsID = usersChatRoomsID => ({
    type: SET_USERSCHATROOMSID,
    payload: usersChatRoomsID
});

export const setNotification = notification => ({
    type: SET_NOTIFICATION,
    payload: notification
});