import React, { Component } from "react";
import * as api from "./Api";

import "./App.css";

import Selector from "./components/selector/Selector";
import List from "./components/list/List";
import New from "./components/new/New";
import Toast from "./components/toast/Toast";

class App extends Component {
  state = {
    categories: [],
    selectedCategory: 0,
    memes: [],
    showNew: false,
    online: true,
    showToast: null
  };

  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories() {
    api
      .fetchCategories()
      .then(categories => this.setState({ categories }))
      .then(_ => this.fetchMemes(0));
  }

  fetchMemes(selectedCategory) {
    if (!this.state.categories.length) return;

    let category = this.state.categories[selectedCategory];

    return api
      .fetchMemes(category.key)
      .then(memes => this.setState({ selectedCategory, memes }));
  }

  selectedCategoryChanged(direction) {
    let selectedCategory = this.state.selectedCategory + direction;

    if (selectedCategory < 0)
      selectedCategory = this.state.categories.length - 1;
    else if (selectedCategory >= this.state.categories.length)
      selectedCategory = 0;

    this.fetchMemes(selectedCategory);
  }

  new() {
    this.setState({ showNew: true });
  }

  reloadMemes() {
    this.fetchMemes(this.state.selectedCategory).then(_ =>
      this.setState({ showNew: false })
    );
  }

  render() {
    return (
      <div className="App">
        <Selector
          categories={this.state.categories}
          selectedCategory={this.state.selectedCategory}
          selectedCategoryChanged={direction =>
            this.selectedCategoryChanged(direction)
          }
        />

        <button className="new" type="button" onClick={_ => this.new()}>
          <i>+</i>
        </button>

        {this.state.memes && !this.state.showNew && (
          <List memes={this.state.memes} />
        )}

        {this.state.showNew && (
          <New
            category={this.state.categories[this.state.selectedCategory].key}
            reloadMemes={() => this.reloadMemes()}
          />
        )}
      </div>
    );
  }
}

export default App;
