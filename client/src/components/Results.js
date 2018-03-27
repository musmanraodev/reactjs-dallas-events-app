import React, { Component } from "react";
import { connect } from "react-redux";
import {
  updateMenu,
  updateResults,
  areTwoArrSame,
  updateItemInfoModal,
  addFavItemToDB,
  deleteFavItemFromDB,
  updateRsvpState,
  fetchRsvpDataFromBackend,
  udpateShownEventsLength
} from ".././actions/eventsAppActions";
import FlipMove from 'react-flip-move';

class Results extends Component {

  shouldComponentUpdate(newProps, newState) {
    if (
      this.props.eventsAppStore.fetched !== newProps.eventsAppStore.fetched ||
      this.props.eventsAppStore.updateResults !== newProps.eventsAppStore.updateResults ||
      this.props.eventsAppStore.userInput.searchBoxValue !== newProps.eventsAppStore.userInput.searchBoxValue ||
      JSON.stringify(this.props.eventsAppStore.favDataFromDB) !== JSON.stringify(newProps.eventsAppStore.favDataFromDB) ||
      !this.props.dispatch(areTwoArrSame(this.props.eventsAppStore.eventsDataFromMeetupAPI, newProps.eventsAppStore.eventsDataFromMeetupAPI))
    ) {
      return true;
    } else {
      return false;
    }
  }

  filterSearchInput = arr => {
    let newArr = [...arr];
    let searchBoxValue = this.props.eventsAppStore.userInput.searchBoxValue;
    if (searchBoxValue !== null && searchBoxValue.trim() !== "") {
      newArr = newArr.filter(e => e.name.toLowerCase().includes(searchBoxValue.toLowerCase()));
    }
    this.props.dispatch(udpateShownEventsLength(newArr.length));
    return newArr;
  }

  handleFavButton = item => {
    if (this.props.eventsAppStore.userInfo.id === null) {
      let savedItemsObj = JSON.parse(localStorage.getItem("savedItemsObj")) || {};
      if (savedItemsObj[item.item_id] === undefined) {
        savedItemsObj[item.item_id] = item;
      } else if (savedItemsObj[item.item_id] !== undefined) {
        delete savedItemsObj[item.item_id];
      }
      localStorage.setItem("savedItemsObj", JSON.stringify(savedItemsObj));
      // this.forceUpdate();
      this.props.dispatch(updateMenu());
      this.props.dispatch(updateResults());
    } else {
      if (this.props.eventsAppStore.favDataFromDB[item.item_id] === undefined) {
        this.props.dispatch(addFavItemToDB(item, this.props.eventsAppStore.userInfo.id));
      } else {
        this.props.dispatch(deleteFavItemFromDB(item.item_id, this.props.eventsAppStore.userInfo.id));
      }
    }
  };

  handleMoreDetailsBttn = (item) => {
    this.props.dispatch(updateItemInfoModal(item, true));
  }

  handleRsvpBttn = (id) => {
    this.props.dispatch(updateRsvpState(true));
    this.props.dispatch(updateItemInfoModal(null, true));
    this.props.dispatch(fetchRsvpDataFromBackend(id));
  }

  renderList = () => {
    let savedItemsObj = (this.props.eventsAppStore.hasFetchedFavDataFromDB && this.props.eventsAppStore.favDataFromDB) || (JSON.parse(localStorage.getItem("savedItemsObj"))) || {};
    let monthArr = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEV"];
    let eventsData = this.filterSearchInput(this.props.eventsAppStore.eventsDataFromMeetupAPI);
    if (eventsData.length > 0) {
      return eventsData.map((item, index) => {
        let date = item.local_date.split('-');
        let headingDate = `${date[2]} ${monthArr[date[1] - 1]}`;
        return (
          <li key={item.item_id} className="list">
            <div className="image-container">
              <h3 className="heading-date">{headingDate}</h3>
            </div>
            <div className="content-container">
              <h4 className="name">{item.name}</h4>
              <p ><span>Attendees: </span>{item.yes_rsvp_count}</p>
              <p ><span>Date: </span>{`${date[1]}/${date[2]}/${date[0]}`}</p>
              <p>
                <span>Address:</span>
                <div>{item.address_1} {item.address_2}</div>
                <div>{item.city}, {item.country}</div>
              </p>

              <button className="bttn more-details-bttn" onClick={() => this.handleMoreDetailsBttn(item)}>More Details</button>
              <button className="bttn more-details-bttn" onClick={() => this.handleRsvpBttn(item.item_id)}>View RSVP</button>
              <button className="bttn more-details-bttn" onClick={() => window.open(item.link)}>View Meetup</button>
              <div className={"fav-star " + ((savedItemsObj[item.item_id]) ? "fav-star-filled" : "")} onClick={() => this.handleFavButton(item)}></div>
            </div>
          </li>
        );
      });
    } else {
      return <h1>Nothing was found</h1>
    }
  };

  renderLoading = () => {
    return <h1 className="loading">Loading</h1>
  }

  render() {
    return (
      <div className="results">
        {(!this.props.eventsAppStore.fetched) ? this.renderLoading() : (
          <ul>
            <FlipMove className="flip-move" >
              {this.renderList()}
            </FlipMove>
          </ul>)}
      </div>
    );
  }
}

function mapStateToProps({ eventsAppStore }) {
  return { eventsAppStore };
}

export default connect(mapStateToProps)(Results);
