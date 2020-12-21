export const SET_AUTHENTICATION = 'SET_AUTHENTICATION';
export const SET_AUTHENTICATED_USER_ID = 'SET_AUTHENTICATED_USER_ID';
export const SET_AUTHENTICATED_USERNAME = 'SET_AUTHENTICATED_USERNAME';
export const SET_ISSIDEBAROPEN = 'SET_ISSIDEBAROPEN';
export const SET_CURRENTCHATROOMID = 'SET_CURRENTCHATROOMID';
export const SET_CURRENTCHATROOM = 'SET_CURRENTCHATROOM';
export const SET_CURRENTCHATROOMNAME = 'SET_CURRENTCHATROOMNAME';
export const SET_USERSCHATROOMSID = 'SET_USERSCHATROOMSID';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';



export const setAuthentication = authStatus => ({
    type: SET_AUTHENTICATION,
    payload: authStatus
});

export const setAuthenticatedUserID = authenticatedUserID => ({
    type: SET_AUTHENTICATED_USER_ID,
    payload: authenticatedUserID
});

export const setAuthenticatedUsername = authenticatedUsername => ({
    type: SET_AUTHENTICATED_USERNAME,
    payload: authenticatedUsername
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