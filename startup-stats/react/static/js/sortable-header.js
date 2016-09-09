import Component, * as React from 'react';
import {Cell} from 'fixed-data-table';

export default class SortHeader extends React.Component {
  constructor(props) {
    super(props)

    this._onSortChange = this._onSortChange.bind(this);
    this.state = {
      sorted : false
    }
  }

  _onSortChange(e) {
    e.preventDefault();

    this.setState({
      sorted : true
    });

    if (this.props.onSortChange) {
      this.props.onSortChange(this.props.col);
    }
  }

  render() {
    let sorted = this.state.sorted;

    let {onSortChange, col, sortedBy, ...props} = this.props;

    return <Cell {...props}>
      <a onClick={this._onSortChange}>
        {col} {sortedBy === col ? '↓' : ''}
      </a>
    </Cell>
  }
}
