export default function reducer(
  state = {
    eventsDataFromMeetupAPI: [],
    shouldFetch: true,
    fetched: false,
    userInput: { searchBoxValue: null, sortBy: "Best Match", maxResults: 25 },
    error: null,
    comingFromInput: false,
    updateMenu: 0,
    updateResults: 0,
    itemInfoForModal: null,
    showItemInfoModal: false,
    isSideBarOpen: false,
    userInfo: { id: null, username: null, email: null },
    userInfoFetched: false,
    favDataFromDB: {},
    hasFetchedFavDataFromDB: false,
    shownEventsLength: 0,
    showRSVP: false,
  },
  action
) {
  switch (action.type) {
    case "FETCH_EVENTS_DATA_FROM_MEETUP_API_REJECTED": {
      return { ...state, fetched: true, error: action.payload, eventsDataFromMeetupAPI: [] };
    }

    case "FETCH_EVENTS_DATA_FROM_MEETUP_API_FULFILLED": {
      return {
        ...state,
        shouldFetch: false,
        fetched: true,
        eventsDataFromMeetupAPI: action.payload.eventsDataFromMeetupAPI,
        comingFromInput: false,
      };
    }

    case "FETCH_RSVP_DATA_FROM_MEETUP_API_REJECTED": {
      return { ...state, error: action.payload, itemInfoForModal: null };
    }

    case "FETCH_RSVP_DATA_FROM_MEETUP_API_FULFILLED": {
      return {
        ...state,
        itemInfoForModal: action.payload.itemInfoForModal,
      };
    }

    case "FETCH_FAV_DATA_FROM_DATABASE_FULFILLED": {
      return {
        ...state,
        favDataFromDB: action.payload,
        hasFetchedFavDataFromDB: true,
      };
    }

    case "CHANGE_hasFetchedFavDataFromDB": {
      return {
        ...state,
        hasFetchedFavDataFromDB: action.payload,
      };
    }

    case "ADD_FAV_ITEM_TO_DB_FULFILLED": {
      return {
        ...state,
        favDataFromDB: { ...state.favDataFromDB, [action.payload.item_id]: action.payload },
      };
    }

    case "DELETE_FAV_ITEM_FROM_DB_FULFILLED": {
      return {
        ...state,
        favDataFromDB: Object.keys(state.favDataFromDB).reduce((result, key) => {
          if (key !== action.payload) {
            result[key] = state.favDataFromDB[key];
          }
          return result;
        }, {}),
      };
    }

    case "EMPTY_FAV_DATA_FROM_DB": {
      return {
        ...state,
        favDataFromDB: {},
        hasFetchedFavDataFromDB: false,
      };
    }

    case "CHANGE_ShouldFetch": {
      return {
        ...state,
        shouldFetch: action.payload,
      };
    }

    case "CHANGE_USERINPUT_SortBy": {
      return {
        ...state,
        userInput: { ...state.userInput, sortBy: action.payload }
      };
    }

    case "CHANGE_USERINPUT_SearchBoxValue": {
      return {
        ...state,
        userInput: { ...state.userInput, searchBoxValue: action.payload }
      };
    }

    case "CHANGE_USERINPUT_MaxResults": {
      return {
        ...state,
        userInput: { ...state.userInput, maxResults: action.payload }
      };
    }

    case "CHANGE_USERINFO_ID": {
      return {
        ...state,
        userInfo: { ...state.userInfo, id: action.payload },
        userInfoFetched: true,
      };
    }

    case "CHANGE_USERINFO_USERNAME": {
      return {
        ...state,
        userInfo: { ...state.userInfo, username: action.payload }
      };
    }

    case "CHANGE_USERINFO_EMAIL": {
      return {
        ...state,
        userInfo: { ...state.userInfo, email: action.payload }
      };
    }

    case "CHANGE_ComingFromInput": {
      return {
        ...state,
        comingFromInput: action.payload,
      };
    }

    case "UPDATE_MENU": {
      return {
        ...state,
        updateMenu: state.updateMenu + 1,
      };
    }

    case "UPDATE_RESULTS": {
      return {
        ...state,
        updateResults: state.updateResults + 1,
      };
    }

    case "UPDATE_SIDEBAR_STATE": {
      return {
        ...state,
        isSideBarOpen: action.payload,
      };
    }

    case "ZOOM_IMAGE": {
      return {
        ...state,
        itemInfoForModal: action.payload.itemInfoForModal,
        showItemInfoModal: action.payload.showItemInfoModal,
      };
    }

    case "UPDATE_RSVP_STATE": {
      return {
        ...state,
        showRSVP: action.payload.showRSVP,
        itemInfoForModal: null,
      };
    }

    case "UPDATE_SHOWN_EVENTS_LENGTH": {
      return {
        ...state,
        shownEventsLength: action.payload.shownEventsLength,
      };
    }

    default:
      return state;
  }
}
