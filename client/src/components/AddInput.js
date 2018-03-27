import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import {
  fetchMeetupApiDataFromBackend,
  changeUserInputSearchBoxValue,
  changeUserInputSortBy,
  changeShouldFetch,
  changeComingFromInput,
  changeUserInputMaxResults,
  changeUrlToUserInput,
} from "../actions/eventsAppActions";

class AddInput extends Component {
  shouldComponentUpdate(newProps, newState) {
    let oldData = this.props.eventsAppStore;
    let newData = newProps.eventsAppStore;
    if (
      oldData.userInput.searchBoxValue !== newData.userInput.searchBoxValue ||
      oldData.userInput.maxResults !== newData.userInput.maxResults
    ) {
      return true;
    } else {
      return false;
    }
  }

  trimSpaces = value => {
    if (value.trim() === "") {
      return false;
    } else {
      value = value.trim();
      return true;
    }
  };

  componentDidUpdate(prevProps) {
    this.updateURL();
  }

  submitForm = () => {
    this.props.dispatch(changeShouldFetch(true));
    this.props.dispatch(changeComingFromInput(true));
    this.props.dispatch(fetchMeetupApiDataFromBackend(this.props.eventsAppStore.userInput.maxResults, this.props.eventsAppStore.userInput.sortBy));
  };

  updateURL = () => {
    this.props.dispatch(changeUrlToUserInput(this.props.eventsAppStore.userInput.searchBoxValue, this.props.eventsAppStore.userInput.sortBy, this.props.eventsAppStore.userInput.maxResults, this.props.history))
  };

  handleSearchBoxValue = e => {
    this.props.dispatch(changeUserInputSearchBoxValue(e.target.value));
  }

  render() {
    const horizontalLabels = {
      0: 'Low',
      50: 'Medium',
      100: 'High'
    }

    return (
      <div className="add-input">
        <form className="form" onSubmit={(e) => {
          e.preventDefault();
          this.submitForm();
        }}>
          <div >
            <h3 className="heading"><span> Search</span></h3>
            <input
              type="text"
              id="thing"
              name="searchBox"
              placeholder="Hi!"
              value={(this.props.eventsAppStore.userInput.searchBoxValue == null ? "" : this.props.eventsAppStore.userInput.searchBoxValue)}
              onChange={this.handleSearchBoxValue}
              ref="searchBox"
              className="search-box-input"
            />
          </div>
          <div className='slider custom-labels'>
            <h3 className="heading"><span>Max Results</span></h3>
            <Slider
              min={0}
              max={100}
              value={this.props.eventsAppStore.userInput.maxResults}
              labels={horizontalLabels}
              onChange={(e) => this.props.dispatch(changeUserInputMaxResults(e))}
              onChangeComplete={this.submitForm}
            />
            <hr />
          </div>
          <button className="bttn search-form-bttn">Search</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps({ eventsAppStore }) {
  return { eventsAppStore };
}

export default withRouter(connect(mapStateToProps)(AddInput));
