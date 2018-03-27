export function fetchMeetupApiDataFromBackend(maxResults, sortBy) {
  ['Best Match', 'Most Attendees', 'Least Attendees', 'Earliest Date', 'Latest Date']
  if (sortBy === "Most Attendees") {
    sortBy = { method: "members", type: false }
  } else if (sortBy === "Least Attendees") {
    sortBy = { method: "members", type: true }
  } else if (sortBy === "Earliest Date") {
    sortBy = { method: "time", type: false }
  } else if (sortBy === "Latest Date") {
    sortBy = { method: "time", type: true }
  } else if (sortBy === "Best Match") {
    sortBy = { method: "BestMatch", type: null }
  }
  return function (dispatch) {
    fetch('/eventsApi/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        maxResults,
        sortBy,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        if (!responseJson) {
          dispatch({ type: "FETCH_EVENTS_DATA_FROM_MEETUP_API_REJECTED", payload: null });
        } else {
          let data = fixMeetupApiData(responseJson)
          dispatch({
            type: "FETCH_EVENTS_DATA_FROM_MEETUP_API_FULFILLED",
            payload: {
              eventsDataFromMeetupAPI: responseJson,
            },
          });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCH_EVENTS_DATA_FROM_MEETUP_API_REJECTED", payload: err });
      });
  };
}

function fixMeetupApiData(arr) {
  return arr.forEach(item => {
    item.item_id = item.id;
    item.address_1 = item.venue.address_1;
    item.address_2 = item.venue.address_2;
    item.city = item.venue.city;
    item.country = item.venue.country.toUpperCase();
  })
}

export function fetchRsvpDataFromBackend(id) {
  return function (dispatch) {
    fetch('/eventsApi/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        id,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        if (!responseJson) {
          dispatch({ type: "FETCH_RSVP_DATA_FROM_MEETUP_API_REJECTED", payload: null });
        } else {
          dispatch({
            type: "FETCH_RSVP_DATA_FROM_MEETUP_API_FULFILLED",
            payload: {
              itemInfoForModal: responseJson,
            },
          });
        }
      })
      .catch(err => {
        dispatch({ type: "FETCH_RSVP_DATA_FROM_MEETUP_API_REJECTED", payload: err });
      });
  };
}

export function transferDataFromLocalStorageToDB(userId) {
  return function (dispatch) {
    let favLocalStorageItems = JSON.parse(localStorage.getItem("savedItemsObj"));
    for (let key in favLocalStorageItems) {
      dispatch(addFavItemToDB(favLocalStorageItems[key], userId));
    }
    localStorage.setItem("savedItemsObj", null);
  };
}

export function fetchFavDataFromDatabase(userId) {
  return function (dispatch) {
    fetch('/fav/show', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        user_id: userId,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        dispatch({ type: "FETCH_FAV_DATA_FROM_DATABASE_FULFILLED", payload: responseJson.data.data });
      })
  };
}

export function change_hasFetchedFavDataFromDB(data) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_hasFetchedFavDataFromDB", payload: data });
  };
}

export function addFavItemToDB(item, userId) {
  return function (dispatch) {
    fetch('/fav/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        item_id: item.id,
        user_id: userId,
        name: item.name,
        local_date: item.local_date,
        address_1: item.address_1,
        address_2: item.address_2,
        city: item.city,
        country: item.country,
        yes_rsvp_count: item.yes_rsvp_count,
        link: item.link,
        description: item.description,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        dispatch({ type: "ADD_FAV_ITEM_TO_DB_FULFILLED", payload: responseJson.data.data });
      })
  };
}

export function deleteFavItemFromDB(item_id, userId) {
  return function (dispatch) {
    fetch('/fav/destroy', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        item_id: item_id,
        user_id: userId,
      }),
    })
      .then(res => res.json())
      .then((responseJson) => {
        dispatch({ type: "DELETE_FAV_ITEM_FROM_DB_FULFILLED", payload: item_id });
      })
  };
}

export function areTwoArrSame(arrOne, arrTwo) {
  return function () {
    if (arrOne.length !== arrTwo.length) {
      return false;
    }
    for (let i = 0; i < arrOne.length; i++) {
      if (JSON.stringify(arrOne[i]) !== JSON.stringify(arrTwo[i]))
        return false;
    }
    return true;
  };
}

export function changeUrlToUserInput(searchBoxValue, sortBy, maxResults, history) {
  return function (dispatch) {
    history.push(`/Search=${searchBoxValue}&sortBy=${sortBy}&maxResults=${maxResults}`);
  };
}

export function changeUserInputSortBy(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_SortBy", payload: value });
  };
}

export function changeUserInputSearchBoxValue(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_SearchBoxValue", payload: value });
  };
}

export function changeUserInputMaxResults(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINPUT_MaxResults", payload: value });
  };
}

export function changeUserInfoId(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_ID", payload: value });
  };
}

export function changeUserInfoUsername(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_USERNAME", payload: value });
  };
}

export function changeUserInfoEmail(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_USERINFO_EMAIL", payload: value });
  };
}

export function playAuthFailedAnimation(ele, animation) {
  return function () {
    ele.classList.add(animation);
    setTimeout(() => {
      ele.classList.remove(animation);
    }, 1000);
  };
}

export function changeShouldFetch(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_ShouldFetch", payload: value });
  };
}

export function changeComingFromInput(value) {
  return function (dispatch) {
    dispatch({ type: "CHANGE_ComingFromInput", payload: value });
  };
}

export function updateMenu() {
  return function (dispatch) {
    dispatch({ type: "UPDATE_MENU", payload: null });
  };
}

export function updateResults() {
  return function (dispatch) {
    dispatch({ type: "UPDATE_RESULTS", payload: null });
  };
}

export function emptyFavDataFromDB() {
  return function (dispatch) {
    dispatch({ type: "EMPTY_FAV_DATA_FROM_DB", payload: null });
  };
}

export function updateSideBarState(value) {
  return function (dispatch) {
    dispatch({ type: "UPDATE_SIDEBAR_STATE", payload: value });
  };
}

export function updateItemInfoModal(itemInfoForModal, showItemInfoModal) {
  return function (dispatch) {
    dispatch({
      type: "ZOOM_IMAGE",
      payload: {
        itemInfoForModal,
        showItemInfoModal,
      },
    });
  };
}

export function updateRsvpState(showRSVP) {
  return function (dispatch) {
    dispatch({
      type: "UPDATE_RSVP_STATE",
      payload: {
        showRSVP,
      },
    });
  };
}

export function udpateShownEventsLength(shownEventsLength) {
  return function (dispatch) {
    dispatch({
      type: "UPDATE_SHOWN_EVENTS_LENGTH",
      payload: {
        shownEventsLength,
      },
    });
  };
}
