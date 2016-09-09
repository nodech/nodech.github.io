import * as React from 'react';
import {Cell} from 'fixed-data-table';

export const CounterCell = ({rowIndex, ...props}) => (
  <Cell {...props}>{rowIndex + 1}</Cell>
)

export const TextCell = ({rowIndex, data, col, ...props}) => {
  return (
    <Cell {...props}>{data[rowIndex][col]}</Cell>
  );
};

export const NumberCell = (({rowIndex, data, col, ...props}) =>
  <Cell {...props}>{data[rowIndex][col].toPrecision(3)}</Cell>
);

export class EditNumCell extends React.Component {
  constructor(props) {
    super(props);

    let {rowIndex, data, col} = this.props;
    this.state = {
      value : data[rowIndex][col]
    }
  }

  onChange(event) {
    let val = event.target.value;
    if (this.props.onChangeValue) {
      let {rowIndex, col} = this.props;
      this.props.onChangeValue(rowIndex, col, val);
    }

    this.setState({
      value : val
    })
  }

  render() {
    let {rowIndex, data, col, onChangeValue, ...props} = this.props;
    let value = data[rowIndex][col];

    return (
      <Cell {...props}>
        <input 
        type="text"
        value={this.state.value != value ? value : this.state.value}
        onChange={this.onChange.bind(this)}
        className="numcell"
        />
      </Cell>
    )
  }
}

